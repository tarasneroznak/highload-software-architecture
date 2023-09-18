FROM ubuntu:latest AS builder

RUN apt-get update && apt-get install -y \
    git \
    build-essential \
    wget \
    libpcre3-dev \
    zlib1g-dev \
    openssl \
    libssl-dev

ARG NGINX_SOURCE_URL=http://nginx.org/download/nginx-1.25.0.tar.gz
ARG EXTERNAL_MODULE_URL=http://labs.frickle.com/files/ngx_cache_purge-2.3.tar.gz 

RUN mkdir -p /tmp/nginx && \
    cd /tmp/nginx && \
    wget -O nginx.tar.gz ${NGINX_SOURCE_URL} && \
    tar -zxf nginx.tar.gz

RUN mkdir -p /tmp/external-module && \
    cd /tmp/external-module && \
    wget -O external-module.tar.gz ${EXTERNAL_MODULE_URL} && \
    tar -zxf external-module.tar.gz
    
WORKDIR /tmp/nginx/nginx-1.25.0
RUN ./configure --add-module=/tmp/external-module/ngx_cache_purge-2.3 && \
    make && \
    make install

FROM ubuntu:latest

RUN mkdir -p /var/log/nginx
RUN ln -sf /dev/stdout /var/log/nginx/access.log 

COPY --from=builder /usr/local/nginx/sbin/nginx /usr/local/nginx/sbin/nginx

COPY nginx.conf /usr/local/nginx/conf/nginx.conf

CMD ["/usr/local/nginx/sbin/nginx", "-g", "daemon off;"]
