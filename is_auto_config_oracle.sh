#!/bin/sh

#=====================================================================================================
#
#修改以下环境变量适合你的环境,其中：
#
#    IS_HOST_NAME            IS身份管理服务器的机器的主机域名  如:is.cd.mtn
#    IS_NAME                 IS身份管理服务器的安装目录，bin文件夹所在的目录.如：/opt/gdsapps/wso2is-5.7.0
#    JAVA_HOME               JDK的安装目录，如：/usr/java/jdk1.8.0_144
#    IS_PORTS_OFFSET         IS身份管理服务器的机器的端口偏移量，默认是0，控制台默认端口是9443，若偏移量设为1 ，则控制台端口是“默认端口+偏移量”，也就是9444. IS的其它端口也会一起偏移
#    IS_SERVER_DISPLAY_NAME  IS身份管理服务器的显示名称，在管理控制台的首页上显示。如：XXXXX学院统一身份管理服务器
#======================================================================================================
export IS_HOME=/opt/wangf/wso2is/certs-work/wso2is-5.7.0
export JAVA_HOME=/opt/java/jdk1.8.0_144
export DB_HOST=192.168.3.49
export DB_PORT=1521
export DB_SID=kyy
export DB_USERNAME=WSO2CARBON
export DB_PASSWORD=a1b2c3
export PORT DB_MINIDLE=5

export DB_JDBC_DRIVER_JAR=./ojdbc6.jar

#-----------------------------------------------------------------------------------------
#以下信息不用修改。前提是：
#IS的版本是5.7.0  IS的服务器证书库的storepass是wso2carbon JRE的安全证书库的storepass是changeit
#-----------------------------------------------------------------------------------------
#下面是IS的服务器的主数据源配置文件
export IS_MAST_DATASOURCES=$IS_HOME/repository/conf/datasources/master-datasources.xml
export IS_BPS_DATASOURCES=$IS_HOME/repository/conf/datasources/bps-datasources.xml
export IS_METRICS_DATASOURCES=$IS_HOME/repository/conf/datasources/metrics-datasources

export DB_URL=jdbc:oracle:thin:@$DB_HOST:$DB_PORT/$DB_SID
#为了使用JDK的keytool命令
export PATH=$JAVA_HOME/bin:$PATH

#-------------------------------------------------------------------------------------------
# 检查环境变量设置
if [ -z "$DB_SID" ]; then
  echo "DB_SID 环境变量必须设置."
  exit 1
fi

if [ -z "$IS_HOME" ]; then
  echo "IS_HOME 环境变量必须设置."
  exit 1
fi

if [ -z "$JAVA_HOME" ]; then
  echo "JAVA_HOME 环境变量必须设置."
  exit 1
fi

if [ -z "$DB_HOST" ]; then
  echo "DB_HOST 环境变量必须设置."
  exit 1
fi

#-------------------------------------------------------------------------------------------
# 安装数据库驱动
cp $DB_JDBC_DRIVER_JAR $IS_HOME/repository/components/lib
#-------------------------------------------------------------------------------------------
# 替换carbon.xml文件的配置
sed -i "s#jdbc:h2:./repository/database/WSO2CARBON_DB;DB_CLOSE_ON_EXIT=FALSE;LOCK_TIMEOUT=60000#$DB_URL#g" $IS_HOME/repository/conf/datasources/master-datasources.xml
sed -i "s/<username>wso2carbon/<username>$DB_USERNAME/g" $IS_HOME/repository/conf/datasources/master-datasources.xml
sed -i "s/<password>wso2carbon/<password>$DB_PASSWORD/g" $IS_HOME/repository/conf/datasources/master-datasources.xml
sed -i "s/<driverClassName>org.h2.Driver/<driverClassName>oracle.jdbc.OracleDriver/g" $IS_HOME/repository/conf/datasources/master-datasources.xml
#确保多次运行该本，只替换一次.因为源文件中H2数据库配置中没有<minIdle>元素，需要通过替换方法自动给添加上去
if [ `grep -c "<minIdle>5</minIdle>" $IS_HOME/repository/conf/datasources/master-datasources.xml` -eq 0 ];then  
    sed -i "s#<maxWait>60000</maxWait>#<maxWait>60000</maxWait>\r        <minIdle>5</minIdle>#g" $IS_HOME/repository/conf/datasources/master-datasources.xml
fi
sed -i "s#<validationQuery>SELECT 1</validationQuery>#<validationQuery>SELECT 1 FROM DUAL</validationQuery>#g" $IS_HOME/repository/conf/datasources/master-datasources.xml
echo
echo "========================================================"
echo "恭喜！！！       IS服务器的数据库配置已修改为ORACLE，可以启动起来看看了."
echo "启动命令为：$IS_HOME/bin/wso2server.sh "
echo "或 用命令：sh $IS_HOME/bin/wso2server.sh [start | stop | restart] 后台运行 |停止 | 重新启动"