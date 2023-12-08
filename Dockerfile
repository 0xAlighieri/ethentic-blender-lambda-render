FROM nytimes/blender:3.2-cpu-ubuntu18.04 
ENV DEBIAN_FRONTEND noninteractive
RUN apt-get update -qq
RUN apt-get install -y -qq --no-install-recommends ca-certificates git make
# Install aws-lambda-cpp build dependencies (for aws-lambda-ric)
RUN apt-get install -y -qq g++ unzip cmake automake autoconf libtool libcurl4-openssl-dev
RUN apt-get install -y -qq imagemagick

# install node
ADD nodesource14.sh /nodesource14.sh
RUN ["chmod", "+x", "/nodesource14.sh"]
RUN bash nodesource14.sh
RUN apt-get install -y nodejs

ENV NODE_ENV production
RUN rm -rf /var/lib/apt/lists/*
# avoids an error when calling openscad program:
RUN mkdir -p /root/.local/share /.local/share

WORKDIR /usr/src/app
COPY package.json package-lock.json /usr/src/app/
RUN npm ci --only=production
COPY app/ /usr/src/app/

COPY ./ethentic_v4.py /usr/src/app/ethentic_v4.py
COPY ./arch_docker.blend /usr/src/app/arch_docker.blend

CMD ["/usr/bin/npx", "aws-lambda-ric", "index.handler"]
