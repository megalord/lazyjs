var lazy = require('./index');
var sinon = require('sinon');
var chai = require('chai');

var expect = chai.expect;

describe('lazy', function () {
  var lazyArray;
  var colors = ['blue', 'orange', 'yellow', 'red', 'green', 'purple', 'white'];

  beforeEach(function () {
    lazyArray = lazy(colors.slice());
  });

  describe('isolated accessor methods', function () {
    describe('every()', function () {
      describe('when the condition is always met', function () {
        it('returns true', function () {
          expect(lazyArray.every(function () {
            return true;
          })).to.be.true;
        });
      });

      describe('when the condition is not met', function () {
        it('returns false', function () {
          expect(lazyArray.every(function () {
            return false;
          })).to.be.false;
        });

        it('stops iterating', function () {
          var stub = sinon.stub().returns(false);
          lazyArray.every(stub);
          expect(stub).to.have.been.calledOnce;
        });
      });
    });

    describe('first()', function () {
      it('returns the first element', function () {
        expect(lazyArray.first()).to.equal(colors[0]);
      });
    });

    describe('last()', function () {
      it('returns the last element', function () {
        expect(lazyArray.last()).to.equal(colors[colors.length - 1]);
      });
    });

    describe('nth()', function () {
      it('returns the element at the specified index', function () {
        expect(lazyArray.nth(3)).to.equal(colors[3]);
        expect(lazyArray.nth(5)).to.equal(colors[5]);
      });
    });

    describe('slice()', function () {
      describe('with the end argument', function () {
        describe('when the end is greater than the length of the source array', function () {
          it('returns an array with all elements after the start argument', function () {
            var end = colors.length + 2;
            expect(lazyArray.slice(4, end)).to.eql(colors.slice(4));
          });
        });

        describe('when the end is lte the length of the source array', function () {
          it('returns an array containing the elements between the indices', function () {
            expect(lazyArray.slice(1, 4)).to.eql(colors.slice(1, 4));
            expect(lazyArray.slice(3, 7)).to.eql(colors.slice(3, 7));
          });
        });
      });

      describe('without the end argument', function () {
        it('returns an array with all elements after the index', function () {
          expect(lazyArray.slice(4)).to.eql(colors.slice(4));
        });
      });
    });

    describe('some()', function () {
      describe('when the condition is met', function () {
        it('returns true', function () {
          expect(lazyArray.some(function () {
            return true;
          })).to.be.true;
        });

        it('stops iterating', function () {
          var stub = sinon.stub().returns(true);
          lazyArray.some(stub);
          expect(stub).to.have.been.calledOnce;
        });
      });

      describe('when the condition is never met', function () {
        it('returns false', function () {
          expect(lazyArray.some(function () {
            return false;
          })).to.be.false;
        });
      });
    });

    describe('value()', function () {
      it('returns the array', function () {
        expect(lazyArray.value()).to.eql(colors);
      });
    });
  });

  describe('range()', function () {
    describe('with one argument', function () {
      it('creates a range from 0 to the provided integer', function () {
        expect(lazy.range(5).value()).to.eql([0, 1, 2, 3, 4]);
      });
    });
    describe('with two arguments', function () {
      it('creates a range between the two integers', function () {
        expect(lazy.range(3, 8).value()).to.eql([3, 4, 5, 6, 7]);
      });
    });
  });
});
