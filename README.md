# Blender

Docker container to run blender renders in AWS Lambda

## Emulating the lambda

```sh
make emulate
curl -XPOST "http://localhost:9001/2015-03-31/functions/function/invocations" -d "{someKey: someVal}"
# or
node test/test.mjs
```

## Getting started

Assuming you have blender installed at the command line (e.g., `blender` launches the app at the cml), run the following command to render the included STL file. Replace this STL argument with any other STL you would like rendered out to PNG.

``` bash
blender arch_docker.blend --background --python ethentic_v4.py -- 10.stl pla peach cove
```

### Docker Command Example

This command will run the NY-Times Docker Image inside of your current directory and perform the render inside of the Docker container. just replace withe last argument with the name of your STL.

```bash
docker pull nytimes/blender:2.93-cpu-ubuntu18.04

docker run -w /tmp/ --volume $(pwd):/tmp/ nytimes/blender:2.93-cpu-ubuntu18.04 blender script_v2.blend --background --python ethentic_v2.py -- causeways_7.stl alumide orange

#UPDATED
docker run -w /tmp/ --volume $(pwd):/tmp/ nytimes/blender:2.93-cpu-ubuntu18.04 blender arch_docker.blend --background --python ethentic_v4.py -- 10.stl pla peach cove

```
