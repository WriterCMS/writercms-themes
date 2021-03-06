var module = angular.module('writer.controllers');

module.controller('ArchiveCtrl', function($scope, $stateParams, $timeout, PostService, CategoryService, UserService) {
    $scope.loadingCategories = true;
    $scope.loadingAuthors = true;
    $scope.query = { categories: [], authors: [] };

    var filterOnLoad;
    if ($stateParams.category) {
        Array.isArray($stateParams.category) ? $scope.query.categories = $stateParams.category : $scope.query.categories.push($stateParams.category);
        filterOnLoad = true;
    }

    if ($stateParams.author) {
        Array.isArray($stateParams.author) ? $scope.query.authors = $stateParams.author : $scope.query.authors.push($stateParams.author);
        filterOnLoad = true;
    }

    CategoryService.getAllCategories().success(function(response) {
        $scope.categories = response;
        $scope.loadingCategories = false;
    }).error(function(err) {
        Materialize.toast('Det gick inte att hämta kategorier.', 2000);
        $scope.loadingCategories = false;
        console.log(err);
    });

    UserService.getAllUsers().success(function(response) {
        $scope.authors = response;
        $scope.loadingAuthors = false;
    }).error(function(err) {
        Materialize.toast('Det gick inte att hämta kategorier.', 2000);
        $scope.loadingAuthors = false;
        console.log(err);
    });

    $scope.toggleFilter = function(param, id) {
        var index = $scope.query[param].indexOf(id);
        if (index !== -1) {
            $scope.query[param].splice(index, 1);
        } else {
            $scope.query[param].push(id);
        }
    }

    var init = true;
    $scope.$watch('query', function() {
        if (init) {
            $timeout(function() { init = false; });
        } else {
            filter();
        }
    }, true);

    function filter() {
        if ($scope.query.categories.length == 0 && $scope.query.authors.length == 0) {
            $scope.posts = [];
        } else {
            $scope.loadingPosts = true;
            $scope.posts = [];
            PostService.filter($scope.query).success(function(response) {
                $scope.posts = response;
                $scope.loadingPosts = false;
            }).error(function(err) {
                Materialize.toast('Det gick inte att filtrera inlägg!', 2000);
                $scope.loadingPosts = false;
                console.log(err);
            });
        }
    }

    if (filterOnLoad) {
        filter();
    }

    $scope.$emit('newPageLoaded', {
        title: 'Arkiv',
        description: 'Filtrera inlägg efter författare och kategorier.',
        author: 'Axel Niklasson',
        image: {
            url: 'http://66.media.tumblr.com/3dbf290f6477026a098a8369e1d96665/tumblr_mj9jshtzH01qadknpo1_1280.jpg'
        }
    });
});
