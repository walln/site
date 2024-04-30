---
title: Flurry
publishDate: 2023-01-23
description: A simple, performance, and highly-configurable proxy server written with Golang.
tags: ["backend-development", "performance"]
---

Built with Golang, Flurry was my solution for an API gateway. Very few simple proxies are easily composable for a simple application that needs microservices proxied out to different hosts (mainly behind a VPC). Flurry is a web proxy designed for easy configuration and plugins for authentication and logging out of the box. New plugins are easy to create and configure.

Looking at the marketplace of proxies and gateways, projects like kong and nginx are exciting but were too much effort, and I wanted some plugins like firebase authentication for the project I was working on. Flurry is not an ideal solution for most use cases, but it worked for mine. You can check out the source code on [GitHub](https://github.com/walln/Flurry2).

I may be adding new plugins and features in the future. However, at the moment, I am not using Flurry for anything.