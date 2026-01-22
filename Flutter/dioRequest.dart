/*
 * @Author: water.li
 * @Date: 2026-01-14 20:39:28
 * @Description: 
 * @FilePath: \Notebook\Flutter\dioRequest.dart
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

  get(String url, {Map<String, dynamic>? params}) {
    return _handleResponse(_dio.get(url, queryParameters: params));
  }

  _handleResponse(Future<Response<dynamic>> task) async {
    try {
      Response<dynamic> res = await task;
      final data = res.data as Map<String, dynamic>;
      if (data['code'] == '1') {
        return data['result'];
      }
      throw Exception(data['message']);
    } catch (e) {
      throw Exception(e);
    }
  }
}

final dioRequest = DioRequest(); // 单例对象
