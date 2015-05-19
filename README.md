# [Ember VCL](https://github.com/ember-vcl/doc) Build Demo

The `build-demo` package creates demo apps for [Ember VCL components](https://github.com/ember-vcl)
It can be used for testing/development of an individual component.

## Usage

### How to build a demo for a component

1. Checkout the component
2. Run `npm install`
3. Run `npm test`

If everything is fine, a new browser window will be opened at http://localhost:3333 showing the component demo.

For example, [the navigation component](https://github.com/ember-vcl/navigation):

```
git clone https://github.com/ember-vcl/navigation.git
cd navigation
npm install
npm test
```

### How add demo for an existing component w/o one

1. Add the `build-demo` package as a dependency into the component's `package.json`
2. Define `npm test` command in package.json as `"test": "cd tmp && gulp watch"`
3. Create a folder called `demo` in the component's root folder
4. Create a folder called `example` in the `demo` folder
5. Create two files: `application.js` and `application.hbs`. The `application.js` must export an Ember controller and the application.hbs should contain the application template
6. Commit the changes and create a release

Now you can build the demo according to the [How to build a demo for a component](#how-to-build-a-demo-for-a-component)

## Demo

[See instructions how to run a demo app](https://github.com/ember-vcl/build-demo)

## License

[MIT license](LICENSE.txt)
