./gradlew war
scp C:/tmp/pomorskie-latest.osm.pbf root@147.135.210.1:/opt/map/pomorskie-latest.osm.pbf
scp ./build/libs/mgrVRP-rest-0.1.war root@147.135.210.1:/root/ROOT.war
ssh root@147.135.210.1 cp /root/ROOT.war /opt/tomcat/webapps/ROOT.war

