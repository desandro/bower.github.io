---
title: Configuration
layout: default
---

<p class="lead">Bower can be configured using JSON in a `.bowerrc` file.</p>

## .bowerrc specification

### cwd

_String_

The directory from which bower should run. All relative paths will be calculated 
according to this setting.  

### directory

_String_

The path in which installed components should be saved. If not specified this 
defaults to `bower_components`.  

### registry 

_Object_ or _String_

The registry config. Can be an object or a string. If a string is used, all the 
property values bellow will have its value. Defaults to the bower registry URL.

If your organization wishes to maintain a private registry, you may change the 
values below.

#### registry.search 

_Array_ or _String_

An array of URLs pointing to read-only Bower registries. A string means only 
one. When looking into the registry for an endpoint, Bower will query these 
registries by the specified order.

#### registry.register

_String_

The URL to use when registering packages. 

#### registry.publish

_String_

The URL to use when publish packages.  

### shorthand-resolver

_String_

Define a custom template for shorthand package names.  
Defaults to `git://github.com/<owner>/<package>.git`

The `shorthand-resolver` key provides support for defining a custom template 
which Bower uses when constructing a URL for a given shorthand. For example, if 
a shorthand of `twitter/flight` or `twitter/flight#v1.0.0` is specified in the 
package's manifest dependencies, the following data can be referenced from 
within the `shorthand-resolver` template:

    owner: "twitter"  
    package: "flight"  
    shorthand: "twitter/flight"

Examples:

    "shorthand-resolver": "git://example.com/{{owner}}/components/{{package}}.git"
    "shorthand-resolver": "git://example.com/{{shorthand}}.git"

### proxy

_String_

The proxy to use for http requests.

### https-proxy

_String_

The proxy to use for https requests.

### user-agent

_String_

Sets the User-Agent for each request made.  
Defaults to: `node/<process.version> <process.platform> <process.arch>`

### timeout

_Number_

The timeout to be used when making requests in milliseconds, defaults to 
`60000` ms.

### strict-ssl

_Boolean_

Whether or not to do SSL key validation when making requests via https.

### ca

_Object_ or _String_

The CA certificates to be used, defaults to null. This is similar to the 
registry key, specifying each CA to use for each registry endpoint.

The Certificate Authority signing certificate that is trusted for SSL 
connections to the registry.  
Set to null to only allow "known" registrars, or to a specific CA cert to trust 
only that specific signing authority.

### color

_Boolean_

Enable or disable use of colors in the CLI output. Defaults to true.

### storage

_Object_

Where to store persistent data, such as cache, needed by bower. Defaults to 
paths that suite the OS/platform. Valid keys are `cache`, `registry`, `links`, 
`completion`.

### tmp

_String_

Where to store temporary files and folders. Defaults to the system temporary 
directory suffixed with /bower.

### interactive

_Boolean_

Makes bower interactive, prompting whenever necessary. Defaults to `null` which 
means `auto`.

## Order

The config is obtained by merging multiple configurations by this order of 
importance:

* cli args via --config.
* environment variables
* local bowerrc located in the cwd
* all bowerrc files upwards the directory tree
* bowerrc file located in the home folder
* bowerrc file located in the global folder

Example of valid environment variables:

* `bower_endpoint_parser` is evaluated as `endpoint-parser`
* `bower_storage__cache` is evaluated as `storage.cache`
