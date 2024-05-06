---
title: Flurry
publishDate: 2023-01-23 CST
description: A simple, performance, and highly-configurable proxy server written with Golang.
tags: ["backend-development", "performance", "golang"]
---

Built with Golang, Flurry was my solution for an API gateway. Very few simple proxies are easily composable for a simple application that needs microservices proxied out to different hosts (mainly behind a VPC). Flurry is a web proxy designed for easy configuration and plugins for authentication and logging out of the box. New plugins are easy to create and configure.

Looking at the marketplace of proxies and gateways, projects like [Kong](https://konghq.com/) and [NGINX](https://www.nginx.com/) are exciting but were too much effort to extend, and I wanted some plugins like firebase authentication for the project I was working on. Flurry is not an ideal solution for most use cases, but it worked for mine. You can check out the source code on [GitHub](https://github.com/walln/Flurry2).

Lets take a quick look at how to use Flurry. First create a Go project, install Flurry as a dependency and then add the following code.

```go title="main.go"
import "github.com/walln/flurry2"

func main() {
    server := flurry.Initialize()
    server.ListenAndServe()
}

```

Here is an example configuration for Flurry

```yaml title="config.yml"
name: Flurry Server
authentication: JWT
signingMethod: HMAC
routes:
  - endpoint: '/users/user/{id}'
    host: 'https://example.com'
    authenticated: true
    methods:
      - GET
      - POST
      - PUT
      - DELETE
  - endpoint: /users
    host: 'https://example.com'
    authenticated: false
    methods:
      - GET
```

Compile your program and then run with the created configuration

```sh
./main -f config.yml
```

Now you have a proxy running that redirects to your other services. Providing logging, authentication, and simple configuration. You can deploy this gateway and just update the config when your services change, no need to rebuild or build these features into the downstream services. In our example we redirect all `/users/user/{id}` requests assuming the user is authenticated.
 
When you hit the proxy

```sh
curl https://my-flurry-domain.com/users/user/12
```

Your request is validated, logged, and then forwarded to `https://example.com/users/user/12`.

I may be adding new plugins and features in the future. However, at the moment, I am not using Flurry for anything.
