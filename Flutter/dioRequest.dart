/*
 * @Author: water.li
 * @Date: 2026-01-14 20:39:28
 * @Description: 
 * @FilePath: \Notebook\Flutter\dioUtils.dart
 */

import 'package:dio/dio.dart';

class DioRequest {
  final Dio _dio = Dio();

  DioRequest() {
    _dio.options
      ..baseUrl = 'https://geek.itheima.net/v1_0/'
      ..connectTimeout = const Duration(seconds: 5)
      ..sendTimeout = const Duration(seconds: 5)
      ..receiveTimeout = const Duration(seconds: 5);

    // 拦截器
    _addInterceptor();
  }

  void _addInterceptor() {
    _dio.interceptors.add(
      InterceptorsWrapper(
        onRequest: (context, handler) {
          // handler.next(requestOptions); // 通过
          // handler.reject(error) // 拦截
          handler.next(context);
        },
        onResponse: (context, handler) {
          if (context.statusCode! >= 200 && context.statusCode! <= 300) {
            return handler.next(context);
          }
          handler.reject(DioException(requestOptions: context.requestOptions));
        },
        onError: (context, handler) {
          handler.reject(context);
        },
      ),
    );
  }

  Future<Response<dynamic>> get(String url, {Map<String, dynamic>? params}) {
    return _dio.get(url, queryParameters: params);
  }
}

final dioRequest = DioRequest(); // 单例对象
