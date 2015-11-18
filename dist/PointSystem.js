'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })(); /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        * This file is part of the physics library.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        * (c) Magnus Bergman <hello@magnus.sexy>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        * For the full copyright and license information, please view the LICENSE
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        * file that was distributed with this source code.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        */

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _Vec = require('./Vec2');

var _Vec2 = _interopRequireDefault(_Vec);

var _Point = require('./Point');

var _Point2 = _interopRequireDefault(_Point);

var _Spring = require('./Spring');

var _Spring2 = _interopRequireDefault(_Spring);

var _Attraction = require('./Attraction');

var _Attraction2 = _interopRequireDefault(_Attraction);

var _Integrator = require('./Integrator');

var _Integrator2 = _interopRequireDefault(_Integrator);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var DEFAULT_GRAVITY = 0;
var DEFAULT_DRAG = 0.001;

/**
 * This is the PointSystem class.
 *
 * @author Magnus Bergman <hello@magnus.sexy>
 */

var PointSystem = (function () {

  /**
   * Create a PointSystem.
   *
   * @param {number} gravityX
   * @param {number} gravityY
   * @param {number} drag
   *
   * @return void
   */

  function PointSystem() {
    var gravityX = arguments.length <= 0 || arguments[0] === undefined ? DEFAULT_GRAVITY : arguments[0];
    var gravityY = arguments.length <= 1 || arguments[1] === undefined ? DEFAULT_GRAVITY : arguments[1];

    _classCallCheck(this, PointSystem);

    var drag = arguments.length <= 2 || arguments[2] === undefined ? DEFAULT_DRAG : arguments[2];

    this.equilibriumCriteria = {
      points: true,
      springs: true,
      attractions: true
    };

    this.equilibrium = false; // are we at equilibrium?
    this.optimized = false;

    this.points = [];
    this.springs = [];
    this.attractions = [];
    this.forces = [];
    this.integrator = new _Integrator2.default(this);
    this.hasDeadPoints = false;

    this.DEFAULT_GRAVITY = DEFAULT_GRAVITY;
    this.DEFAULT_DRAG = DEFAULT_DRAG;

    this.gravity = new _Vec2.default(gravityX, gravityY);
    this.drag = drag;
  }

  /**
   * Set whether to optimize the simulation. This enables the check of whether
   * points are moving.
   *
   * @param {bool} b
   *
   * @return {object} Instance of PointSystem.
   */

  _createClass(PointSystem, [{
    key: 'optimize',
    value: function optimize(b) {
      this.optimized = !!b;

      return this;
    }

    /**
     * Set global gravity for the system.
     *
     * @param {number} x
     * @param {number} y
     *
     * @return {object} Instance of PointSystem.
     */

  }, {
    key: 'setGravity',
    value: function setGravity(x, y) {
      this.gravity.set(x, y);

      return this;
    }

    /**
     * Set criteria for equilibrium.
     *
     * @param {array} points
     * @param {array} springs
     * @param {array} attractions
     *
     * @return {void}
     */

  }, {
    key: 'setEquilibriumCriteria',
    value: function setEquilibriumCriteria(points, springs, attractions) {
      this.equilibriumCriteria.points = !!points;
      this.equilibriumCriteria.springs = !!springs;
      this.equilibriumCriteria.attractions = !!attractions;
    }

    /**
     * Update the integrator
     *
     * @return {object} Instance of PointSystem.
     */

  }, {
    key: 'tick',
    value: function tick() {
      this.integrator.step(arguments.length === 0 ? 1 : arguments[0]);

      if (this.optimized) {
        this.equilibrium = !this.needsUpdate();
      }

      return this;
    }

    /**
     * Checks all points, springs and attractions to see if the points/
     * contained points are inert/resting and returns a boolean.
     *
     * @return {bool}
     */

  }, {
    key: 'needsUpdate',
    value: function needsUpdate() {
      if (this.equilibriumCriteria.points) {
        for (var i = 0; i < this.points.length; i++) {
          if (!this.points[i].resting()) {
            return true;
          }
        }
      }

      if (this.equilibriumCriteria.springs) {
        for (var i = 0; i < this.springs.length; i++) {
          if (!this.springs[i].resting()) {
            return true;
          }
        }
      }

      if (this.equilibriumCriteria.attractions) {
        for (var i = 0; i < this.attractions.length; i++) {
          if (!this.attractions[i].resting()) {
            return true;
          }
        }
      }

      return false;
    }

    /**
     * Add a point to the PointSystem.
     *
     * @param {Point} p
     *
     * @return {PointSystem}
     */

  }, {
    key: 'addPoint',
    value: function addPoint(p) {
      this.points.push(p);

      return this;
    }

    /**
     * Add a spring to the PointSystem.
     *
     * @param {Spring} s
     *
     * @return {PointSystem}
     */

  }, {
    key: 'addSpring',
    value: function addSpring(s) {
      this.springs.push(s);

      return this;
    }

    /**
     * Add an attraction to the PointSystem.
     *
     * @param {Attraction} a
     *
     * @return {PointSystem}
     */

  }, {
    key: 'addAttraction',
    value: function addAttraction(a) {
      this.attractions.push(a);

      return this;
    }

    /**
     * Creates and then adds Point to PointSystem.
     *
     * @param {number} mass
     * @param {number} x
     * @param {number} y
     *
     * @return {Point}
     */

  }, {
    key: 'createPoint',
    value: function createPoint(mass, x, y) {
      var point = new _Point2.default(mass, x, y);

      this.addPoint(point);

      return point;
    }

    /**
     * Create and then adds Spring to PointSystem.
     *
     * @param {Point} a
     * @param {Point} b
     * @param {number} k
     * @param {number} d
     * @param {number} l
     *
     * @return {Spring}
     */

  }, {
    key: 'createSpring',
    value: function createSpring(a, b, k, d, l) {
      var spring = new _Spring2.default(a, b, k, d, l);

      this.addSpring(spring);

      return spring;
    }

    /**
     * Create and then adds Attraction to PointSystem.
     *
     * @param {Point} a
     * @param {Point} b
     * @param {number} k
     * @param {number} d
     *
     * @return {Attraction}
     */

  }, {
    key: 'createAttraction',
    value: function createAttraction(a, b, k, d) {
      var attraction = new _Attraction2.default(a, b, k, d);

      this.addAttraction(attraction);

      return attraction;
    }

    /**
     * Clears the PointSystem of all points, springs and attractions.
     *
     * @return {void}
     */

  }, {
    key: 'clear',
    value: function clear() {
      this.points.length = 0;
      this.springs.length = 0;
      this.attractions.length = 0;
    }

    /**
     * Calculate and apply forces.
     *
     * @return {PointSystem}
     */

  }, {
    key: 'applyForces',
    value: function applyForces() {
      if (!this.gravity.isZero()) {
        for (var i = 0; i < this.points.length; i++) {
          this.points[i].force.addSelf(this.gravity);
        }
      }

      var t = new _Vec2.default();

      for (var i = 0; i < this.points.length; i++) {
        var p = this.points[i];

        t.set(p.velocity.x * -1 * this.drag, p.velocity.y * -1 * this.drag);

        p.force.addSelf(t);
      }

      for (var i = 0; i < this.springs.length; i++) {
        this.springs[i].update();
      }

      for (var i = 0; i < this.attractions.length; i++) {
        this.attractions[i].update();
      }

      for (var i = 0; i < this.forces.length; i++) {
        this.forces[i].update();
      }

      return this;
    }

    /**
     * Clears all forces from points in the system.
     *
     * @return {PointSystem}
     */

  }, {
    key: 'clearForces',
    value: function clearForces() {
      for (var i = 0; i < this.points.length; i++) {
        this.points[i].clear();
      }

      return this;
    }
  }]);

  return PointSystem;
})();

exports.default = PointSystem;