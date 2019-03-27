# Kentico Cloud Content management javascript SDK

> Javascript SDK for the [Kentico Cloud Content Management API](https://developer.kenticocloud.com/v1/reference#content-management-api-v2). Helps you manage content in your [Kentico Cloud](https://kenticocloud.com/) projects. Supports both `node.js` and `browsers`.

[![npm version](https://badge.fury.io/js/kentico-cloud-content-management.svg)](https://www.npmjs.com/package/kentico-cloud-content-management)
[![Build Status](https://api.travis-ci.org/Kentico/kentico-cloud-js.svg?branch=master)](https://travis-ci.org/Kentico/kentico-cloud-js)
[![CircleCI](https://circleci.com/gh/Kentico/kentico-cloud-js/tree/master.svg?style=svg)](https://circleci.com/gh/Kentico/kentico-cloud-js/tree/master)
[![npm](https://img.shields.io/npm/dt/kentico-cloud-content-management.svg)](https://www.npmjs.com/package/kentico-cloud-delivery)
[![Forums](https://img.shields.io/badge/chat-on%20forums-orange.svg)](https://forums.kenticocloud.com)
[![Known Vulnerabilities](https://snyk.io/test/github/Kentico/kentico-cloud-js/badge.svg)](https://snyk.io/test/github/kentico/kentico-cloud-js)
[![GitHub license](https://img.shields.io/github/license/Kentico/kentico-cloud-js.svg)](https://github.com/Kentico/kentico-cloud-js)
![Gzip bundle](https://img.badgesize.io/https://cdn.jsdelivr.net/npm/kentico-cloud-content-management/_bundles/kentico-cloud-cm-sdk.umd.min.js?compression=gzip)
[![](https://data.jsdelivr.com/v1/package/npm/kentico-cloud-content-management/badge)](https://www.jsdelivr.com/package/npm/kentico-cloud-content-management)


## Getting started

To get started, you'll first need to have access to your [Kentico Cloud](https://kenticocloud.com/) project where you need to enable Content management API and generate `access token` that will be used to authenticate all requests made by this library.

### Installation

This library has a peer dependency on `rxjs`which means you need to install it as well. You install it using `npm` or use it directly in browser using one of the `cdn` bundles. 

#### npm

```
npm i rxjs --save
npm i kentico-cloud-content-management --save
```

#### Using a standalone version in browsers

If you'd like to use this library directly in browser, place following script tags to your html page. You may of course download it and refer to local versions of scripts.

```javascript
<script src="https://cdn.jsdelivr.net/npm/rxjs/bundles/rxjs.umd.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/kentico-cloud-content-management/_bundles/kentico-cloud-cm-sdk.umd.min.js"></script>
```

### Making the first request

The following code example shows how to create new content item in your Kentico Cloud project.

```javascript
import { ContentManagementClient } from 'kentico-cloud-content-management';

const client = new ContentManagementClient({
        projectId: 'xxx', // id of your Kentico Cloud project
        apiKey: 'yyy', // Content management API token
    });

    client.addContentItem()
        .withData(
            {
                name: 'New article',
                type: {
                    codename: 'article' // codename of content type
                }
            }
        )
        .toObservable()
        .subscribe((response) => {
            // work with response
        },
        (error) => {
            // handle error
        });
```

If you are using `UMD` bundles directly in browsers, you can find this library under `KenticoCloudContentManagement` global variable. 

```html
<!DOCTYPE html>
<html>
<head>
	<title>Kentico Cloud CM | jsdelivr cdn</title>
    <script src="https://cdn.jsdelivr.net/npm/rxjs/bundles/rxjs.umd.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/kentico-cloud-content-management/_bundles/kentico-cloud-cm-sdk.umd.min.js"></script>
</head>
<body>
    <script type="text/javascript">
        var CM = window['KenticoCloudContentManagement'];

		var client = new CM.ContentManagementClient({
			projectId: 'xxx',
			apiKey: 'yyy'
		});

		client.addContentItem()
            .withData(
                {
                    name: 'New article',
                    type: {
                        codename: 'article'
                    },
                }
            )
            .toObservable()
            .subscribe((response) => {
                // work with response
            },
            (error) => {
                // handle error
            });
	</script>
</body>
</html>
```

### Configuration

The `ContentManagementClient` contains several configuration options:

```javascript
const client = new ContentManagementClient({
    // configuration options
});
```

| Option  | Default | Description |
| ------------- | ------------- | ------------- |
| `projectId` | N/A | **Required** - Id of your Kentico Cloud project  |
| `apiKey` | N/A  | **Required** - Content management API Token  |
| `baseUrl` | https://manage.kenticocloud.com/v2/projects  | Base URL of REST api. Can be useful if you are using custom proxy or for testing purposes |
| `retryAttempts` | 3 |  Number of retry attempts when error occures. To disable set the value to 0. |
| `httpService` | HttpService  | Used to inject implementation of `IHttpService` used to make HTTP request across network. Can also be useful for testing purposes by returning specified responses. |
| `retryStatusCodes` | [500] | Array of request status codes that should be retried. |

### API Reference

Online [API Reference](https://kentico.github.io/kentico-cloud-js/content-management) documents latest version of this library and can be used to quickly find all exposed methods and objects. Documentation is generated from `TypeScript` code and thus it should always be accurate.

### Testing

> If you want to mock http responses, it is possible to use [external implementation of configurable Http Service](../core/README.md#testing) as a part of the [client configuration](#configuration).

### Troubleshooting & feedback

If you have any issues or want to share your feedback, please feel free to [create an issue](https://github.com/Kentico/kentico-cloud-js/issues/new/choose) in this GitHub repository.

### Contributions

Contributions are welcomed. If you have an idea of what you would like to implement, let us know and lets discuss details of your PR.
