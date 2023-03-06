## [3.2.0](https://github.com/achingbrain/it-pb-stream/compare/v3.1.0...v3.2.0) (2023-03-06)


### Features

* allow unwrapping message stream ([#42](https://github.com/achingbrain/it-pb-stream/issues/42)) ([f2169fe](https://github.com/achingbrain/it-pb-stream/commit/f2169fe81e87bc141d972456743affb3e5b6e676))

## [3.1.0](https://github.com/achingbrain/it-pb-stream/compare/v3.0.1...v3.1.0) (2023-03-04)


### Features

* add MessageStream type to make dealing with message streams easier ([#41](https://github.com/achingbrain/it-pb-stream/issues/41)) ([c1fa76a](https://github.com/achingbrain/it-pb-stream/commit/c1fa76a189f3f2b8f8f2444a605d87d91473de80))

## [3.0.1](https://github.com/achingbrain/it-pb-stream/compare/v3.0.0...v3.0.1) (2023-03-01)


### Bug Fixes

* make pbStream function polymorphic ([#40](https://github.com/achingbrain/it-pb-stream/issues/40)) ([ccb2065](https://github.com/achingbrain/it-pb-stream/commit/ccb2065d1147af56b5c1a929635f63443e469205))

## [3.0.0](https://github.com/achingbrain/it-pb-stream/compare/v2.0.4...v3.0.0) (2023-02-23)


### ⚠ BREAKING CHANGES

* The ProtobufStream type is now generic - it can be inferred from the return type of `pbStream` but may need to be specified where it it accepted as an argument

### Bug Fixes

* derive unwrapped stream type from input ([#39](https://github.com/achingbrain/it-pb-stream/issues/39)) ([e85d75e](https://github.com/achingbrain/it-pb-stream/commit/e85d75ed578c2c7525f4657850a6af57dd3635a8))

## [2.0.4](https://github.com/achingbrain/it-pb-stream/compare/v2.0.3...v2.0.4) (2023-02-23)


### Dependencies

* **dev:** bump aegir from 37.12.1 to 38.1.6 ([#38](https://github.com/achingbrain/it-pb-stream/issues/38)) ([6d3136e](https://github.com/achingbrain/it-pb-stream/commit/6d3136eebd68a4bb5dd7bba753e8e73625173cb9))

## [2.0.3](https://github.com/achingbrain/it-pb-stream/compare/v2.0.2...v2.0.3) (2022-12-22)


### Bug Fixes

* relax input type and generate typedocs ([#32](https://github.com/achingbrain/it-pb-stream/issues/32)) ([5709cd9](https://github.com/achingbrain/it-pb-stream/commit/5709cd94921ee64e8491899853d687890cebaa00))

## [2.0.2](https://github.com/achingbrain/it-pb-stream/compare/v2.0.1...v2.0.2) (2022-08-11)


### Dependencies

* update it-handshake ([#30](https://github.com/achingbrain/it-pb-stream/issues/30)) ([02eb7a1](https://github.com/achingbrain/it-pb-stream/commit/02eb7a1b4092497ddfb383c80e3382917fb9ab76))

## [2.0.1](https://github.com/achingbrain/it-pb-stream/compare/v2.0.0...v2.0.1) (2022-08-01)


### Bug Fixes

* use decoder/encoder types from it-length-prefixed ([#29](https://github.com/achingbrain/it-pb-stream/issues/29)) ([935f68d](https://github.com/achingbrain/it-pb-stream/commit/935f68d7139db5312ca9b3a9170977337347a074))

## [2.0.0](https://github.com/achingbrain/it-pb-stream/compare/v1.0.2...v2.0.0) (2022-08-01)


### ⚠ BREAKING CHANGES

* uses new majors of it-length-prefixed and uint8arraylist deps

### Trivial Changes

* update project config ([#25](https://github.com/achingbrain/it-pb-stream/issues/25)) ([5c5a9be](https://github.com/achingbrain/it-pb-stream/commit/5c5a9bea5502a359c04ccd56201a0c8272d73302))


### Dependencies

* update it-length-prefixed and uint8arraylist deps ([#28](https://github.com/achingbrain/it-pb-stream/issues/28)) ([4273397](https://github.com/achingbrain/it-pb-stream/commit/427339745398d5277818949608a7655d0a0266f9))

### [1.0.2](https://github.com/achingbrain/it-pb-stream/compare/v1.0.1...v1.0.2) (2022-03-08)


### Bug Fixes

* rename type ([#3](https://github.com/achingbrain/it-pb-stream/issues/3)) ([1ed038b](https://github.com/achingbrain/it-pb-stream/commit/1ed038bd887570beda3e0a2c520c61ae1eb9e8dd))

### [1.0.1](https://github.com/achingbrain/it-pb-stream/compare/v1.0.0...v1.0.1) (2022-03-08)


### Bug Fixes

* make type name more descriptive ([#2](https://github.com/achingbrain/it-pb-stream/issues/2)) ([1f82fe4](https://github.com/achingbrain/it-pb-stream/commit/1f82fe41cca8e8e2a888e1a94690488d656f9ad9))

## 1.0.0 (2022-03-08)


### ⚠ BREAKING CHANGES

* updates export name

### Features

* update export name ([#1](https://github.com/achingbrain/it-pb-stream/issues/1)) ([2ebf73d](https://github.com/achingbrain/it-pb-stream/commit/2ebf73d63c21aef50ae0470283dc2bbf5455c836))


### Trivial Changes

* initial import ([1b48ff8](https://github.com/achingbrain/it-pb-stream/commit/1b48ff83391235e8483bc32e58f189a1b5b2906f))
