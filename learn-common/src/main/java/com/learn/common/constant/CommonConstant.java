package com.learn.common.constant;

public interface CommonConstant {

    String DEFAULT_CHARSET = "UTF-8";

    String SUCCESS = "success";

    String FAIL = "fail";

    String TOKEN_HEADER = "Authorization";

    String TOKEN_PREFIX = "Bearer ";

    Long TOKEN_EXPIRE_TIME = 7 * 24 * 60 * 60 * 1000L;

    String USER_ID = "userId";

    String USER_NAME = "userName";

    String ROLE_ID = "roleId";

    String LOGIN_USER_KEY = "login:user:";

    String CAPTCHA_KEY = "captcha:";

    Integer CAPTCHA_EXPIRE = 5;

    String REQUEST_ID_HEADER = "X-Request-Id";
}
