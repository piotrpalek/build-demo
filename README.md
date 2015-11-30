# [Ember VCL](https://github.com/ember-vcl/doc) Build Demo

The `build-demo` package creates demo apps for [Ember VCL components](https://github.com/ember-vcl)
It can be used for testing/development of an individual component.

## Usage

### Requirements

```
npm install -g ember-vcl/build-demo jspm gulp gulp-concat gulp-connect gulp-rename gulp-shell gulp-open
```

The following are the current versions:

```
"gulp": "^3.9.0",
"gulp-concat": "^2.6.0",
"gulp-connect": "^2.2.0",
"gulp-rename": "^1.2.0",
"gulp-shell": "^0.4.0",
"gulp-open": "^0.3.0"
```

### How to build a demo for a component

1. Checkout the component
2. Run `npm install`
3. Run `evcl build demo` to generate demo
4. Run `npm start` to start the demo

If everything is fine, a new browser window will be opened at http://localhost:3333 showing the component demo.

For example, [the navigation component](https://github.com/ember-vcl/navigation):

```
git clone https://github.com/ember-vcl/navigation.git
cd navigation
evcl build demo
npm start
```

### How add demo for an existing component w/o one

1. Define `npm start` command in package.json as `"start": "cd tmp && gulp watch"`
2. Create a folder called `demo` in the component's root folder
3. Create a folder called `example` in the `demo` folder
4. Create two files: `application.js` and `application.hbs`. The `application.js` must export an Ember controller and the application.hbs should contain the application template
5. Commit the changes and create a release

Now you can build the demo according to the [How to build a demo for a component](#how-to-build-a-demo-for-a-component)

## Demo

[See instructions how to run a demo app](https://github.com/ember-vcl/build-demo)

## License

[MIT license](LICENSE.txt)
