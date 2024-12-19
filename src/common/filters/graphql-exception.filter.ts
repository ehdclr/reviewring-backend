import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { GqlArgumentsHost } from '@nestjs/graphql';
import { GraphQLError } from 'graphql';
@Catch()
export class GraphqlExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const gqlHost = GqlArgumentsHost.create(host); // GraphQL 컨텍스트 생성
    const context = gqlHost.getContext(); // GraphQL 요청 컨텍스트 가져오기 (예: req, res 등)

    console.error('GraphQL Error:', {
      message: exception.message,
      stack: exception.stack,
      extensions: exception.extensions,
    });

    const errorResponse = {
      message: exception.message || 'Internal server error',
      code: exception.extensions?.code || 'INTERNAL_SERVER_ERROR',
      status: exception.extensions?.status || 500,
    };

    return new GraphQLError(errorResponse.message, {
      extensions: { code: errorResponse.code, status: errorResponse.status },
    });
  }
}
