.PHONY: build_image
ifndef tag
	$(error tag is not set)
endif
build_image:
	docker build -f docker/Dockerfile -t leovie/x-dry-javascript-plugin:$(tag) . --no-cache

.PHONY: build_and_push_image
ifndef tag
	$(error tag is not set)
endif
build_and_push_image: build_image
	docker push leovie/x-dry-javascript-plugin:$(tag)