aws ecr get-login-password --region us-west-1 | docker login --username AWS --password-stdin 165197331959.dkr.ecr.us-west-1.amazonaws.com

docker build -t event-search .

docker tag event-search:latest 165197331959.dkr.ecr.us-west-1.amazonaws.com/event-search:latest

docker push 165197331959.dkr.ecr.us-west-1.amazonaws.com/event-search:latest
