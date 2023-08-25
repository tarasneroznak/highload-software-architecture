FROM ubuntu

RUN apt update && apt install -y hping3 fping slowhttptest siege wget iptables

WORKDIR /app

COPY ./protected-env.sh /app/
COPY ./unprotected-env.sh /app/

COPY ./attacks/udp-flood.sh /app/
COPY ./attacks/icmp-flood.sh /app/
COPY ./attacks/http-flood.sh /app/
COPY ./attacks/slowloris.sh /app/
COPY ./attacks/syn-flood.sh /app/
COPY ./attacks/ping-of-death.sh /app/