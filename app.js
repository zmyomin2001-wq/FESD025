(function () {
  'use strict';

  class OnlineCourse {
    constructor(courseId, title, description, duration, lecturer, category, promote, courseImage) {
      this.courseId = Number(courseId);
      this.title = title;
      this.description = description;
      this.duration = Number(duration);
      this.lecturer = lecturer;
      this.category = category;
      this.promote = Boolean(promote);
      this.courseImage = courseImage;
    }
  }

  const initialCourses = [
    new OnlineCourse(1, 'Microsoft 365', 'Using software within the Microsoft 365 suite.', 30, 'Thida Mankongprasit', 'Basic', false, 'public/course1.png'),
    new OnlineCourse(2, 'Google Workspace', 'Utilizing the Google Workspace software suite.', 30, 'Bowornthat Nanthaphot', 'Basic', true, 'public/course2.png'),
    new OnlineCourse(3, 'Infographic by Canva', 'Using the Canva program to create infographics.', 20, 'Eknat Chongchanya', 'Graphics', true, 'public/course3.png'),
    new OnlineCourse(4, 'Java', 'Fundamental programming with Java.', 30, 'Naphatsorn Ratsameechot', 'Coding', false, 'public/course4.png'),
    new OnlineCourse(5, 'Basic Data Analysis', 'Basic data analysis using Looker Studio.', 20, 'Natthapol Pathumdecha', 'Other', true, 'public/course5.png')
  ];

  angular
    .module('coursePortal', ['ngRoute'])
    .config(routeConfig)
    .controller('PortalController', PortalController);

  routeConfig.$inject = ['$routeProvider'];
  function routeConfig($routeProvider) {
    $routeProvider
      .when('/', { templateUrl: 'home.html' })
      .when('/courses', { templateUrl: 'courses.html' })
      .when('/manage', { templateUrl: 'manage.html' })
      .otherwise({ redirectTo: '/' });
  }

  function PortalController() {
    const vm = this;

    vm.courses = initialCourses.slice();
    vm.categories = ['Basic', 'Graphics', 'Coding', 'Other'];
    vm.images = [1, 2, 3, 4, 5].map(function (number) {
      return { label: 'Course image ' + number, path: 'public/course' + number + '.png' };
    });
    vm.form = blankCourse();
    vm.formVisible = true;
    vm.message = '';
    vm.applicationMessage = '';

    vm.featuredCourses = function () {
      return vm.courses.filter(function (course) { return course.promote; });
    };

    vm.apply = function (course) {
      vm.applicationMessage = 'Application selected for "' + course.title + '".';
    };

    vm.isEditing = function () {
      return vm.form.courseId !== null;
    };

    vm.openCreate = function () {
      vm.form = blankCourse();
      vm.formVisible = true;
      vm.message = '';
    };

    vm.edit = function (course) {
      vm.form = angular.copy(course);
      vm.formVisible = true;
      vm.message = '';
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    vm.save = function (form) {
      if (form.$invalid) return;

      const item = new OnlineCourse(
        vm.isEditing() ? vm.form.courseId : nextId(),
        vm.form.title,
        vm.form.description,
        vm.form.duration,
        vm.form.lecturer,
        vm.form.category,
        vm.form.promote,
        vm.form.courseImage
      );

      if (vm.isEditing()) {
        const index = vm.courses.findIndex(function (course) { return course.courseId === item.courseId; });
        vm.courses[index] = item;
        vm.message = 'Course updated successfully.';
      } else {
        vm.courses.push(item);
        vm.message = 'Course created successfully.';
      }

      vm.form = blankCourse();
      vm.formVisible = true;
      form.$setPristine();
      form.$setUntouched();
    };

    vm.remove = function (courseId) {
      const course = vm.courses.find(function (item) { return item.courseId === courseId; });
      if (!course || !window.confirm('Delete "' + course.title + '"?')) return;
      vm.courses = vm.courses.filter(function (item) { return item.courseId !== courseId; });
      vm.message = 'Course deleted successfully.';
    };

    vm.closeEditor = function (form) {
      vm.form = blankCourse();
      vm.formVisible = true;
      if (form) {
        form.$setPristine();
        form.$setUntouched();
      }
    };

    function nextId() {
      return vm.courses.length ? Math.max.apply(null, vm.courses.map(function (course) { return course.courseId; })) + 1 : 1;
    }

    function blankCourse() {
      return { courseId: null, title: '', description: '', duration: null, lecturer: '', category: '', promote: false, courseImage: '' };
    }
  }
})();
