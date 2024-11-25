FROM nginx:1.27.1

COPY ./nginx.conf /etc/nginx/nginx.conf
RUN rm /etc/nginx/conf.d/default.conf


CMD ["-g", "daemon off;"]
ENTRYPOINT ["nginx"]