FROM ubuntu

RUN apt-get update && apt-get install -y \
    git \
    build-essential \
    wget \
    libpcre3-dev \
    zlib1g-dev \
    openssl \
    libssl-dev \
    software-properties-common 

RUN add-apt-repository ppa:maxmind/ppa && \
    apt-get -y update && \
    apt-get -y install geoipupdate libmaxminddb0 libmaxminddb-dev mmdb-bin

COPY GeoIP.conf /etc/GeoIP.conf

RUN geoipupdate

RUN wget -O ngx_http_geoip2_module-3.4.tar.gz https://github.com/leev/ngx_http_geoip2_module/archive/refs/tags/3.4.tar.gz && \   
    tar -zxf ngx_http_geoip2_module-3.4.tar.gz

RUN wget -O nginx_upstream_check_module-0.4.0 https://github.com/yaoweibin/nginx_upstream_check_module/archive/refs/tags/v0.4.0.tar.gz && \   
    tar -zxf nginx_upstream_check_module-0.4.0

RUN wget http://nginx.org/download/nginx-1.25.0.tar.gz && \
    tar -xzvf nginx-1.25.0.tar.gz && \
    cd nginx-1.25.0 && \
    ./configure \ 
        --add-module=../ngx_http_geoip2_module-3.4 \
        --add-module=../nginx_upstream_check_module-0.4.0 \ 
    && \
    make && \
    make install && \
    cd ..

RUN ln -sf /dev/stdout /usr/local/nginx/logs/access.log && \ 
    ln -sf /dev/stderr /usr/local/nginx/logs/error.log

EXPOSE 80

CMD ["/usr/local/nginx/sbin/nginx", "-g", "daemon off;"]
