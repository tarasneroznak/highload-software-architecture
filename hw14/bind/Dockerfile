FROM sameersbn/bind:9.16.1-20200524

RUN mkdir -p /etc/bind/zones/
RUN mkdir -p /etc/bind/geo/

COPY GeoIP.acl /etc/bind/geo/GeoIP.acl
COPY zones/* /etc/bind/zones/
COPY named.conf /etc/bind/named.conf

EXPOSE 53/udp 53/tcp 10000/tcp

CMD ["/usr/sbin/named"]