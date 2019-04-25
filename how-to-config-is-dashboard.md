

# 1、参考文档

[访问is的dashboard时出现‘SSL peer failed hostname validation for name’错误的问题](https://github.com/wso2/product-is/issues/2763)
# 2、操作步骤
## 2.1 规划IS身份服务器的域名:is.wc.mtn
* 打开<IS_HOME>\repository\carbon.xml文件，修改如下了个配置:

```xml
    <HostName>is.wc.mtn</HostName>
    <MgtHostName>is.wc.mtn</MgtHostName>
```
## 2.1 给is服务器的证书存储库(<IS_HOME>\repository\resources\security\wso2carbon.jks)中添加证书,IS Server使用该证书来进行TLS传输

```shell
cd <IS_HOME>\repository\resources\security
keytool -genkey -alias is.wc.mtn -keyalg RSA  -validity 9999 -dname "EMAILADDRESS=admin@wc.mtn, CN=is.wc.mtn, O=长城数字, L=西安, S=陕西, C=CN, OU=安全中心"  -keystore wso2carbon.jks -storepass wso2carbon
```
> 注意：若不指定-dname 选项 当提示“您的名字与姓氏是什么?”时，不能随便给，必须与IS身份服务器的域名一致，如：is.wc.mtn，其它的提示可随意填写，但最好有意义。
> dname选项中最重要的参数是CN,不能随便给，必须与IS身份服务器的域名一致，如：is.wc.mtn

## 2.2 将IS服务器证书存储库(<IS_HOME>\repository\resources\security\wso2carbon.jks)中的证书导出到<IS_HOME>\repository\resources\security\client-truststore.jks证书存储库中,以便is的dashboard应用使用该证书来访问IS服务器

```shell
cd <IS_HOME>\repository\resources\security

rem 从IS服务器的证书存储库中导出别名为is.wc.mtn的证书（上一步生成的）到当前目录下的is.wc.mtn.crt文件（这个文件会自动创建）
keytool -export -alias is.wc.mtn -file is.wc.mtn.crt -keystore wso2carbon.jks -storepass wso2carbon

rem 将当前目录下证书文件is.wc.mtn.crt中的证书导入到<IS_HOME>\repository\resources\security\client-truststore.jks证书存储库中并指定别名is.wc.mtn
keytool -import -trustcacerts -alias is.wc.mtn -file is.wc.mtn.crt -keystore client-truststore.jks -storepass wso2carbon
```
> 注意: wso2carbon是wso2carbon.jks（server 使用）和client-truststore.jks（dashboard使用）这两个证书存储库的默认密码
