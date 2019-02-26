

# 1、参考文档

[在IS中配置cas Inbound Authenticator](https://docs.wso2.com/display/ISCONNECTORS/Configuring+CAS+Inbound+Authenticator)
# 2、操作步骤

## 2.1 规划IS身份服务器的域名:is.wc.mtn
## 2.2 给is服务器的证书存储库(<IS_HOME>\repository\resources\security\wso2carbon.jks)中添加证书,IS Server使用该证书来进行TLS传输

```shell
cd <IS_HOME>\repository\resources\security
keytool -genkey -alias is.wc.mtn -keyalg RSA -keystore wso2carbon.jks -storepass wso2carbon
```
> 注意：当提示“您的名字与姓氏是什么?”时，不能随便给，必须与IS身份服务器的域名一致，如：is.wc.mtn，其它的提示可随意填写，但最好有意义。

## 2.3 将IS服务器证书存储库(<IS_HOME>\repository\resources\security\wso2carbon.jks)中的证书导出到<JAVA_HOME>\jre\lib\security\cacerts证书存储库中,以便cas客户端应用使用该证书来访问IS服务器

```shell
cd <IS_HOME>\repository\resources\security

rem 从IS服务器的证书存储库中导出别名为is.wc.mtn的证书（上一步生成的）到当前目录下的is.wc.mtn.crt文件（这个文件会自动创建）
keytool -export -alias is.wc.mtn -file is.wc.mtn.crt -keystore wso2carbon.jks -storepass wso2carbon

rem 将当前目录下证书文件is.wc.mtn.crt中的证书导入到<JAVA_HOME>\jre\lib\security\cacerts证书存储库中并指定别名is.wc.mtn
keytool -import -alias is.wc.mtn -file is.wc.mtn.crt -keystore %JAVA_HOME%/jre/lib/security/cacerts -storepass changeit
```
> 注意: changeit是%JAVA_HOME%/jre/lib/security/cacerts这个证书存储库的默认密码

## 2.4 在IS中添加并配置服务提供者
参见：[在IS中配置cas Inbound Authenticator](https://docs.wso2.com/display/ISCONNECTORS/Configuring+CAS+Inbound+Authenticator)
## 2.5 测试SSO
参见：[在IS中配置cas Inbound Authenticator](https://docs.wso2.com/display/ISCONNECTORS/Configuring+CAS+Inbound+Authenticator)

# 附录一 CAS-client-webapp的编写与配置

* WEB-INF\web.xml文件中添加cas过滤器和验证器

```xml
    <filter>
        <filter-name>CAS Authentication Filter</filter-name>
        <filter-class>org.jasig.cas.client.authentication.AuthenticationFilter</filter-class>
        <init-param>
            <param-name>casServerLoginUrl</param-name>
            <param-value>https://is.wc.mtn:9443/identity/cas/login</param-value>
        </init-param>
        <init-param>
            <param-name>serverName</param-name>
            <param-value>https://casclientwebapp1.wc.mtn:8443</param-value>
        </init-param>
    </filter>
    <filter>
        <filter-name>CAS Validation Filter</filter-name>
        <filter-class>org.jasig.cas.client.validation.Cas20ProxyReceivingTicketValidationFilter</filter-class>
        <init-param>
            <param-name>casServerUrlPrefix</param-name>
            <param-value>https://is.wc.mtn:9443/identity/cas</param-value>
        </init-param>
        <init-param>
            <param-name>serverName</param-name>
            <param-value>https://casclientwebapp1.wc.mtn:8443</param-value>
        </init-param>
        <init-param>
            <param-name>redirectAfterValidation</param-name>
            <param-value>true</param-value>
        </init-param>
        <init-param>
            <param-name>useSession</param-name>
            <param-value>true</param-value>
        </init-param>
    </filter>
    <filter>
        <filter-name>CAS HttpServletRequest Wrapper Filter</filter-name>
        <filter-class>org.jasig.cas.client.util.HttpServletRequestWrapperFilter</filter-class>
    </filter>
    <filter-mapping>
        <filter-name>CAS Validation Filter</filter-name>
        <url-pattern>/*</url-pattern>
    </filter-mapping>
    <filter-mapping>
        <filter-name>CAS Authentication Filter</filter-name>
        <url-pattern>/*</url-pattern>
    </filter-mapping>
    <filter-mapping>
        <filter-name>CAS HttpServletRequest Wrapper Filter</filter-name>
        <url-pattern>/*</url-pattern>
    </filter-mapping>
```
> 注意：serverName的值如何配置，取决于你的cas-client-webapp应用的需求，如果也需要https访问，就可以配置为：https://casclientwebapp1.wc.mtn:8443（当然你还要给你的cas-client-webapp所部署的应用服务器上生成应用服务器证书并加以配置）；如果不需要https访问，，就可以配置为：http://casclientwebapp1.wc.mtn:8080

> java cas客户端应用服务器tomcat上配置TSL的方法与示例

> 1、生成服务器证书
```shell
keytool -genkey -alias client.wc.mtn -keyalg RSA -keystore <TOMCAT_HOME>\conf\server.keystore
```
> 执行完毕，会生成server.keystore证书存储库文件，记住创建库是提供的密码，下面配置TLS时会用到

> 2、打开<TOMCAT_HOME>conf\server.xml文件，添加(或修改)如下内容：
```xml
    <Connector port="8443" protocol="HTTP/1.1" SSLEnabled="true"
        maxThreads="150" scheme="https" secure="true"
        clientAuth="false" sslProtocol="TLS"
        keystoreFile="conf/server.keystore"
        keystorePass="changeit" />   
```


* WEB-INF\lib文件夹下添加cas客户端依赖的3个jar文件
```
cas-client-core-3.4.1.jar
cas-client-support-saml-3.4.1.jar
slf4j-api-1.7.1.jar
```
