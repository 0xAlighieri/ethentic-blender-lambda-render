AMAZON_REMOTE = 175729308276.dkr.ecr.us-east-2.amazonaws.com/ethentic-blenderer:latest

.PHONY: build emulate tag push deploy

build:
	docker build --tag ethentic-blenderer:latest .

emulate: build
	docker run --rm -d --env-file .env --name blender-lambda \
	-v `pwd`/scripts:/scripts -p 9001:8080 \
    --entrypoint /scripts/aws-lambda-rie ethentic-blenderer:latest \
		/usr/bin/npx aws-lambda-ric index.handler

login:
	aws ecr get-login-password | docker login --username AWS --password-stdin 175729308276.dkr.ecr.us-east-2.amazonaws.com

tag: build
	docker tag ethentic-blenderer:latest $(AMAZON_REMOTE)

push: tag
	docker push $(AMAZON_REMOTE)

deploy: push
	aws lambda update-function-code --function-name EthenticBlenderer --image-uri $(AMAZON_REMOTE)
