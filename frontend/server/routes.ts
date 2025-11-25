import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import axios from 'axios';

const JAVA_API_BASE_URL = 'http://localhost:8080';

// Standard error response format
interface ErrorResponse {
  message: string;
  error?: string;
  status: number;
}

// Normalize error responses for consistent frontend handling
function normalizeError(status: number, data: any): ErrorResponse {
  let message = 'An error occurred';

  if (status === 400) {
    message = data?.message || 'Validation error';
  } else if (status === 403) {
    message = "You don't have permission to perform this action";
  } else if (status === 409) {
    message = data?.message || 'Conflict - resource already exists or unavailable';
  } else if (status === 401) {
    message = 'Authentication required';
  } else if (status >= 500) {
    message = 'Internal server error';
  }

  return {
    message,
    error: data?.error || data?.message,
    status,
  };
}

// JWT verification middleware (checks presence, doesn't validate signature)
// Signature validation happens in Java backend
function jwtMiddleware(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  const acceptHeader = req.headers.accept || '';
  const isHtmlRequest = typeof acceptHeader === 'string' && acceptHeader.includes('text/html');

  // Public endpoints that don't require authentication
  const publicPaths = ['/auth/login', '/auth/signup-patient'];
  const isPublicPath = publicPaths.some(path =>
    req.originalUrl === path || req.originalUrl.startsWith(path + '?')
  );

  console.log('🔍 JWT Middleware Debug:', {
    url: req.originalUrl,
    method: req.method,
    isPublicPath,
    hasAuthHeader: !!authHeader,
    isHtmlRequest,
    authHeaderPreview: authHeader ? `${authHeader.substring(0, 30)}...` : 'No auth header'
  });

  // Allow browser navigations (HTML) to continue to SPA renderer
  if (isHtmlRequest) {
    return next();
  }

  if (!isPublicPath && !authHeader) {
    console.log('❌ Rejecting request - no token provided');
    return res.status(401).json({
      message: 'Authentication required',
      error: 'NO_TOKEN',
      status: 401,
    });
  }

  next();
}

// Proxy middleware to forward requests to Java Spring Boot API
async function proxyToJavaAPI(req: Request, res: Response, next: NextFunction) {
  try {
    const { method, body, headers } = req;
    const acceptHeader = headers['accept'] || '';
    const isHtmlRequest = typeof acceptHeader === 'string' && acceptHeader.includes('text/html');

    // If this is a browser navigation for HTML, let the SPA renderer handle it
    if (isHtmlRequest) {
      return next();
    }

    // Use originalUrl to preserve query strings
    const targetUrl = `${JAVA_API_BASE_URL}${req.originalUrl}`;

    console.log(`[Proxy] ${method} ${targetUrl}`);
    console.log(`[Proxy] Headers being sent:`, {
      'Content-Type': headers['content-type'] || 'application/json',
      'Authorization': headers.authorization ? `${headers.authorization.substring(0, 30)}...` : 'No auth header'
    });

    // Forward the request to Java API with all headers
    const response = await axios({
      method: method as any,
      url: targetUrl,
      data: body,
      headers: {
        'Content-Type': headers['content-type'] || 'application/json',
        'Authorization': headers.authorization || '',
      },
      validateStatus: () => true, // Don't throw on any status
    });

    console.log(`[Proxy] ${method} ${targetUrl} -> ${response.status}`);
    if (response.status >= 400) {
      console.log(`[Proxy] Error response:`, response.data);
    }

    // Handle error responses with normalization
    if (response.status >= 400) {
      const errorResponse = normalizeError(response.status, response.data);
      return res.status(response.status).json(errorResponse);
    }

    // Forward successful response
    res.status(response.status).json(response.data);
  } catch (error: any) {
    console.error('[Proxy] Error:', error.message);

    // Handle axios errors
    if (error.response) {
      const errorResponse = normalizeError(error.response.status, error.response.data);
      res.status(error.response.status).json(errorResponse);
    } else if (error.code === 'ECONNREFUSED') {
      res.status(503).json({
        message: 'Java API is not available. Please ensure the Spring Boot server is running on http://localhost:8080',
        error: 'SERVICE_UNAVAILABLE',
        status: 503,
      });
    } else {
      res.status(500).json({
        message: 'Proxy error',
        error: error.message,
        status: 500,
      });
    }
  }
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Apply JWT middleware to backend endpoints
  app.use('/auth/*', jwtMiddleware);
  app.use('/admin/*', jwtMiddleware);
  app.use('/doctor/*', jwtMiddleware);
  app.use('/patient/*', jwtMiddleware);

  // Proxy all backend endpoints directly (no /api prefix)
  app.all('/auth/*', proxyToJavaAPI);
  app.all('/admin/*', proxyToJavaAPI);
  app.all('/doctor/*', proxyToJavaAPI);
  app.all('/patient/*', proxyToJavaAPI);

  const httpServer = createServer(app);
  return httpServer;
}
