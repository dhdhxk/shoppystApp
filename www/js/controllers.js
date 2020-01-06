// @note below is way to call scope function of #wardrobe view
// angular.element("#wardrobe").scope().show();
angular.module('starter.controllers', [])
.run(function($rootScope, $ionicTabsDelegate, $state, $ionicPlatform, $ionicPopup, $ionicActionSheet, $timeout, $cordovaCamera, $ionicLoading, $ionicHistory, $location, $ionicBackdrop, $stateParams, $http, $ionicScrollDelegate, DuelService, $cordovaSocialSharing, Wait, RestartApp, FetchNotifications, BlockerMessage, UxAnalytics, Config, SlideHeader, FCMHandler, DeepLink, BusinessObjectStateSync, CanvasService) {
    $rootScope.clientVersion = '1.0';
    $rootScope.minimumForceUpdateVersion = "";
    //$rootScope.baseURL = 'https://app.snaplook.today';
    //$rootScope.baseURL = 'http://localhost:8000';
    //$rootScope.baseURL = 'http://192.168.56.1:8000';
    $rootScope.baseURL = 'http://localhost:8888';
    $rootScope.sampleCount = 4;
    $rootScope.minimumCountToShowSample = 4;
    $rootScope.nameLengthOnCard = 12;
    $rootScope.stat_height = 0;
    $rootScope.stat_label_height = 0;
    $rootScope.currentUser = null;
    $rootScope.notificationCount = "0";
    $rootScope.blockerMessage = BlockerMessage;
    $rootScope.slideHeader = SlideHeader;
    $rootScope.notificationPullInterval = 60000;
    Config.init().then(function(){
        $rootScope.config = Config;
        /*
        Tutorial.init(Config.get('tutorials'));
        $rootScope.tutorial = Tutorial;
        */
        BlockerMessage.init();

        var result = Config.get('minimum_force_update_version');
        if (result)
        {
            $rootScope.minimumForceUpdateVersion = result;
        }
        result = Config.get('notification_pull_interval');
        if (result)
        {
            $rootScope.notificationPullInterval = result;
        }
    });

    $rootScope.scroll = function() {
        $ionicScrollDelegate.scrollBy(0, 100);
    }
    $rootScope.picture = function() {
        DuelService.setPicture(0, 'img/_test_1.jpg', false);
        //DuelService.setPicture(1, 'img/_test_2.jpg', false);
    }
    $rootScope.ifTestAccount = function() {
        if($rootScope.currentUser){
            return $rootScope.currentUser.email == "info@snaplook.today";
        }
        return false;
    }
    $rootScope.photoPath = function(file_name, size) {
        return helper_generatePhotoPath( $rootScope.baseURL, file_name, size );
    };
    $rootScope.currentTab = function(){
        return $ionicTabsDelegate.selectedIndex();
    };
    $rootScope.routeTab = function(id){
        var tab = 'notAssigned';
        switch(id){
            case 0:
                tab = 'explore';
                break;
            case 1:
                tab = 'home';
                break;
            case 2:
                tab = 'camera';
                break;
            case 3:
                tab = 'notification';
                break;
            case 4:
                tab = 'account';
                break;
            case 5:
                tab = 'hidden';
                break;
            default:
                tab = 'newTab';
        }
        return tab;
    };
    $rootScope.linkHashTag = function(str){
        if(str){
            var tab = $rootScope.routeTab($ionicTabsDelegate.selectedIndex());
            str = str.replace(/(#[a-z\d-_]+)/ig, "<a href='#/tab/explore/$1/tag/"+tab+"'>$1</a>");
            str = str.replace(/(\/#)/g, "/");
            return str;
        }
    };
    $rootScope.linkHashTagAndGoal = function(post){
        var content = post.content;
        var tab = $rootScope.routeTab($ionicTabsDelegate.selectedIndex());

        if(content){
            content = content.replace(/(#[a-z\d-_]+)/ig, "<a href='#/tab/search/$1/tag/"+tab+"'>$1</a>");
            content = content.replace(/(\/#)/g, "/");
        }

        return content;
    };
    $rootScope.goPhotoDetail = function(photo){
        if (!$rootScope.canClickInList()) {
            return;
        }
        var tab = $rootScope.routeTab($ionicTabsDelegate.selectedIndex());
        $state.go('tab.photo-detail-'+tab,{photo: photo, photoId: photo.id});
    };
    $rootScope.goPostDetail = function(post, list){
        BusinessObjectStateSync.setPostList(list);
        var tab = $rootScope.routeTab($ionicTabsDelegate.selectedIndex());
        $state.go('tab.single-post-'+tab,{post_id: post.id});
    };
    $rootScope.goPostComment = function(post){
        var tab = $rootScope.routeTab($ionicTabsDelegate.selectedIndex());
        $state.go('tab.post-comments-'+tab,{post: post, postId: post.id});
    };
    $rootScope.goVoteResult = function(post){
        var tab = $rootScope.routeTab($ionicTabsDelegate.selectedIndex());
        $state.go('tab.vote-result-'+tab,{postId: post.id});
    };
    $rootScope.goPostSearch = function(){
        var tab = $rootScope.routeTab($ionicTabsDelegate.selectedIndex());
        $state.go('tab.search-'+tab);
    }
    $rootScope.goPostLikers = function(id){
        var tab = $rootScope.routeTab($ionicTabsDelegate.selectedIndex());
        $state.go('tab.post-likers-'+tab,{postId: id});
    };
    $rootScope.goAccount = function(slug){
        if (!$rootScope.canClickInList() || $rootScope.currentUser.slug == slug) {
            return;
        }
        var tab = $rootScope.routeTab($ionicTabsDelegate.selectedIndex());
        $state.go('tab.account-'+tab,{accountSlug: slug});
    };
    $rootScope.goSchoolDetail = function(id, name){
        var tab = $rootScope.routeTab($ionicTabsDelegate.selectedIndex());
        $state.go('tab.school-detail-'+tab,{schoolId: id, schoolName: name});
    };
    $rootScope.goAccountFollowing = function(slug){
        if(slug){
            var tab = $rootScope.routeTab($ionicTabsDelegate.selectedIndex());
            $state.go('tab.account-following-'+tab,{userSlug: slug});
        }
    };
    $rootScope.goAccountFollower = function(slug){
        if(slug){
            var tab = $rootScope.routeTab($ionicTabsDelegate.selectedIndex());
            $state.go('tab.account-follower-'+tab,{userSlug: slug});
        }
    };
    $rootScope.goSearchPost = function(search_term, type){
        var tab = $rootScope.routeTab($ionicTabsDelegate.selectedIndex());
        $state.go('tab.search-result-'+tab,{searchTerm: search_term, type: type});
    };
    $rootScope.goAccountLiked = function(slug){
        var tab = $rootScope.routeTab($ionicTabsDelegate.selectedIndex());
        $state.go('tab.account-liked-'+tab,{userSlug: slug});
    };
    $rootScope.goAccountNotification = function(){
        var tab = $rootScope.routeTab($ionicTabsDelegate.selectedIndex());
        $state.go('tab.account-notification-'+tab);
    };
    $rootScope.goItems = function(photo){
        var tab = $rootScope.routeTab($ionicTabsDelegate.selectedIndex());
        $state.go('tab.items-'+tab,{photo: photo});
    };
    $rootScope.handleHttpError = function(data, status){
        console.log('data:');
        console.log(data);
        console.log('status:');
        console.log(status);
        if(status == 422 || status == 401){
            // when login or validation error
            for(var key in data){
                $rootScope.popupMessage('', data[key]);
                // problem : multiple errors lead to opening multiple popups in the beginning
                // solution : found out that long computation blocks opening graphical element.
                //            therefore I placed wait service, which runs computation for specific time long.
                Wait.miliSec(100);
            }
        }
        else if(data != null && typeof (data.error) != 'undefined' && data.error == "token_not_provided"){
            RestartApp.go('root');
        }
        else if(data != null && typeof (data.error) != 'undefined' && data.error == "user_not_found"){
            localStorage.removeItem('user');
            localStorage.removeItem('post_id_array');
            RestartApp.go('root');
        }
        else{
            $rootScope.popupMessage('Error', 'An unknown network error has occurred.');
        }
    };
    $rootScope.getCurrentUser = function(){
        if($state.current.name){
            if($rootScope.currentUser){
                return $rootScope.currentUser;
            }
            else{
                var user = JSON.parse(localStorage.getItem('user'));
                if(user){
                    $rootScope.currentUser = user;
                    return $rootScope.currentUser;
                }
            }
            $state.go('auth');
        }
    };
    $rootScope.setCurrentUser = function(user){
        $rootScope.currentUser = user;
        var user_str = JSON.stringify(user);
        localStorage.setItem('user', user_str);
    };
    $rootScope.goAccountOption = function(id){
        $state.go('tab.option-account',{userId: id});
    };
    $rootScope.getNameOnCard = function(_username){
        if (_username.length >= $rootScope.nameLengthOnCard - 1)
        {
            return _username.substring(0, $rootScope.nameLengthOnCard) + "...";
        }
        else
        {
            return _username;
        }
    };
    $rootScope.openCameraMenu = function(picture_index){
        UxAnalytics.startScreen('tab-camera');
        var buttons = [];
        if(picture_index == 1 && DuelService.getPicture(0)){
            buttons = [
                { text: 'Create a New Outfit' },
                { text: 'Import from My Outfit' }
            ];
        }
        if(picture_index == 0 && DuelService.getPicture(1)){
            buttons = [
                { text: 'Create a New Outfit' },
                { text: 'Import from VS Outfit' }
            ];
        }

        if(buttons.length == 0){
            DuelService.setCurrentPictureIndex(picture_index);
            $state.go('tab.canvas');
        }
        else{
            // Show the action sheet
            var navCameraSheet = $ionicActionSheet.show({
                buttons: buttons,
                cancelText: 'Cancel',
                cancel: function() {
                    // code for cancel if necessary.
                },
                buttonClicked: function(index) {
                    $ionicLoading.show();
                    switch (index){
                        /*
                        case 0 :
                            var options = {
                                quality: 50,
                                targetWidth: 2400,
                                targetHeight: 2400,
                                correctOrientation: true,
                                destinationType: Camera.DestinationType.FILE_URI,
                                sourceType: Camera.PictureSourceType.CAMERA
                            };
                            $cordovaCamera.getPicture(options).then(
                                function(imageData) {
                                    DuelService.setPicture(picture_index, imageData);
                                    $ionicLoading.show({template: 'Loading Photo', duration:500});
                                    $ionicLoading.hide();
                                    setTimeout(function () {
                                        $('.post-image .item').each(function(){ $(this).attr('src', $(this).attr('src').replace('unsafe:', '')); });
                                    }, 100);
                                },
                                function(err){
                                    $ionicLoading.hide();
                                }
                            )
                            return true;
                        case 1 :
                            var options = {
                                quality: 50,
                                targetWidth: 2400,
                                targetHeight: 2400,
                                correctOrientation: true,
                                destinationType: Camera.DestinationType.FILE_URI,
                                sourceType: Camera.PictureSourceType.PHOTOLIBRARY
                            };

                            $cordovaCamera.getPicture(options).then(
                                function(imageURI) {
                                    window.resolveLocalFileSystemURL(imageURI, function(fileEntry) {
                                        fileEntry.moveTo(fileEntry.filesystem.root, Date.now() + ".jpg", function (entry) {
                                            DuelService.setPicture(picture_index, entry.nativeURL);
                                            $ionicLoading.show({template: 'Loading Photo', duration:500});
                                            $ionicLoading.hide();
                                            setTimeout(function () {
                                                $('.post-image .item').each(function(){ $(this).attr('src', $(this).attr('src').replace('unsafe:', '')); });
                                            }, 100);
                                        }, function fail(error) {
                                            alert(error.code);
                                        },
                                        function(err){
                                            $ionicLoading.hide();
                                        });
                                    });
                                },
                                function(err){
                                    $ionicLoading.hide();
                                }
                            )
                            //Handle Move Button
                            return true;
                        */
                        case 0 :
                            DuelService.setCurrentPictureIndex(picture_index);
                            $ionicLoading.hide();
                            $state.go('tab.canvas');
                            return true;
                        case 1 :
                            DuelService.setCurrentPictureIndex(picture_index);
                            CanvasService.importState(DuelService.getPictureState(1 - picture_index));
                            $ionicLoading.hide();
                            $state.go('tab.canvas');
                            return true;
                    }
                }
            });
        }
    };
    $rootScope.popupMessage = function(title, message){
        var alertPopup = $ionicPopup.alert({
            title: title,
            template: message
        });
    };
    $rootScope.ifOthersProfile = function(){
        if(
            $rootScope.currentUser &&
            $stateParams.accountSlug &&
            $rootScope.currentUser.slug != $stateParams.accountSlug
        ){
            return true;
        }
        return false;
    };
    $rootScope.ifShowSend = function(){
        return $stateParams.shouldShowSend == 'true';
    };
    $rootScope.getMaxStat = function(stat, index) {
        if (stat === undefined || stat.length == 0)
        {
            return "0";
        }
        stat = stat[0];
        if (index == "gender")
        {
            if (stat === undefined || stat.female === undefined && stat.male === undefined)
            {
                return "0";
            }
            else if (stat.female === undefined || stat.male === undefined || stat.female == 0 || stat.male == 0)
            {
                return "100";
            }
            else if (parseInt(stat.female) > parseInt(stat.male))
            {
                return Math.round(stat.female/(parseInt(stat.female) + parseInt(stat.male))*100);
            }
            else
            {
                return Math.round(stat.male/(parseInt(stat.female) + parseInt(stat.male))*100);
            }
        }
        else
        {
            if (stat === undefined)
            {
                return "10-20 0";
            }

            var age = "10-20";
            var count = 0;
            var total = 0;
            if (stat.teens !== undefined)
            {
                total += parseInt(stat.teens);
            }
            if (stat.twenties !== undefined)
            {
                total += parseInt(stat.twenties);
            }
            if (stat.thirties !== undefined)
            {
                total += parseInt(stat.thirties);
            }
            if (stat.forties !== undefined)
            {
                total += parseInt(stat.forties);
            }
            if (stat.fifties !== undefined)
            {
                total += parseInt(stat.fifties);
            }

            if (stat.teens !== undefined && parseInt(stat.teens) > count)
            {
                age = "10-20";
                count = parseInt(stat.teens);
            }
            if (stat.twenties !== undefined && parseInt(stat.twenties) > count)
            {
                age = "20-30";
                count = parseInt(stat.twenties);
            }
            if (stat.thirties !== undefined && parseInt(stat.thirties) > count)
            {
                age = "30-40";
                count = parseInt(stat.thirties);
            }
            if (stat.forties !== undefined && parseInt(stat.forties) > count)
            {
                age = "40-50";
                count = parseInt(stat.forties);
            }
            if (stat.fifties !== undefined && parseInt(stat.fifties) > count)
            {
                age = "50-60";
                count = parseInt(stat.fifties);
            }

            if(total == 0)
            {
                return age + " 0";
            }
            else
            {
                return age + " " + Math.round(count/total*100);
            }
        }
    };
    $rootScope.getCardGenderStatIcon = function(stat) {
        if (stat == undefined || stat.length == 0)
        {
            return;
        }
        if (stat[0].female === undefined && stat[0].male === undefined)
        {
            return "fa-female";
        }
        else if (stat[0].female === undefined)
        {
            return "fa-male";
        }
        else if (stat[0].male === undefined)
        {
            return "fa-female";
        }
        else if (parseInt(stat[0].female) > parseInt(stat[0].male))
        {
            return "fa-female";
        }
        else
        {
            return "fa-male";
        }
    };
    $rootScope.getStatGenderPercent = function(stat, index) {
        if (stat === undefined || stat.length == 0)
        {
            return "0";
        }
        stat = stat[0];

        if (stat.female === undefined && stat.male === undefined)
        {
            return "0";
        }

        if (stat.male === undefined)
        {
            var male_stat = 0;
        }
        else
        {
            var male_stat = parseInt(stat.male);
        }
        if (stat.female === undefined)
        {
            var female_stat = 0;
        }
        else
        {
            var female_stat = parseInt(stat.female);
        }

        if (index == "m")
        {
            if (male_stat === 0)
            {
                return "0";
            }
            else if (female_stat === undefined || female_stat === null || female_stat === 0)
            {
                return "100";
            }
            else
            {
                return Math.round(male_stat/(female_stat + male_stat)*100);
            }
        }
        else if (index == "f")
        {
            if (female_stat === 0)
            {
                return "0";
            }
            else if (male_stat === undefined || male_stat === null || male_stat === 0)
            {
                return "100";
            }
            else
            {
                return Math.round(female_stat/(female_stat + male_stat)*100);
            }
        }
    };

    $rootScope.getStatGenderPercentForAvatar = function(stat, index) {
        if (stat === undefined || stat.length == 0)
        {
            return 0;
        }
        stat = stat[0];

        if (stat.female === undefined && stat.male === undefined)
        {
            return 0;
        }

        if (stat.male === undefined)
        {
            var male_stat = 0;
        }
        else
        {
            var male_stat = parseInt(stat.male);
        }
        if (stat.female === undefined)
        {
            var female_stat = 0;
        }
        else
        {
            var female_stat = parseInt(stat.female);
        }
        if (index == "m")
        {
            if (male_stat === 0)
            {
                return 0;
            }
            else if (female_stat === undefined || female_stat === null || female_stat === 0)
            {
                return 100;
            }
            else
            {
                return Math.round(male_stat/(female_stat + male_stat)*100);
            }
        }
        else if (index == "f")
        {
            if (female_stat === 0)
            {
                return 0;
            }
            else if (male_stat === undefined || male_stat === null || male_stat === 0)
            {
                return 100;
            }
            else
            {
                return Math.round(female_stat/(female_stat + male_stat)*100);
            }
        }
    };
    $rootScope.getStatAgePercent = function(stat, index) {
        if (stat === undefined || stat.length == 0)
        {
            return "0";
        }
        stat = stat[0];

        var total = 0;
        if (stat.teens !== undefined)
        {
            total += parseInt(stat.teens);
        }
        if (stat.twenties !== undefined)
        {
            total += parseInt(stat.twenties);
        }
        if (stat.thirties !== undefined)
        {
            total += parseInt(stat.thirties);
        }
        if (stat.forties !== undefined)
        {
            total += parseInt(stat.forties);
        }
        if (stat.fifties !== undefined)
        {
            total += parseInt(stat.fifties);
        }

        if (total == 0)
        {
            return "0";
        }
        else if (index == "10")
        {
            if (stat.teens === undefined)
            {
                return "0";
            }
            else
            {
                return Math.round(stat.teens/total*100);
            }
        }
        if (index == "20")
        {
            if (stat.twenties === undefined)
            {
                return "0";
            }
            else
            {
                return Math.round(stat.twenties/total*100);
            }
        }
        if (index == "30")
        {
            if (stat.thirties === undefined)
            {
                return "0";
            }
            else
            {
                return Math.round(stat.thirties/total*100);
            }
        }
        if (index == "40")
        {
            if (stat.forties === undefined)
            {
                return "0";
            }
            else
            {
                return Math.round(stat.forties/total*100);
            }
        }
        if (index == "50")
        {
            if (stat.fifties === undefined)
            {
                return "0";
            }
            else
            {
                return Math.round(stat.fifties/total*100);
            }
        }
    };
    $rootScope.getTimeAgo = function(time){
        return moment.utc(time).fromNow();
    }
    $rootScope.setAnalyticsHeight = function(){
        if ($rootScope.stat_height == 0 && $(".analytics-gender-avatar div").height() > $(".analytics-gender .analytics-number .ng-binding").height())
        {
            $rootScope.stat_height = $(".analytics-gender-avatar div").height();
            $rootScope.stat_label_height = $(".analytics-gender .analytics-number .ng-binding").height();
        }
    };
    $rootScope.getStatAgeHeight = function(stat, index, type) {
        if (stat === undefined || stat.length == 0)
        {
            return "0";
        }
        stat = stat[0];

        var val = 0;
        var total = 0;
        if (stat.teens !== undefined)
        {
            total += parseInt(stat.teens);
        }
        if (stat.twenties !== undefined)
        {
            total += parseInt(stat.twenties);
        }
        if (stat.thirties !== undefined)
        {
            total += parseInt(stat.thirties);
        }
        if (stat.forties !== undefined)
        {
            total += parseInt(stat.forties);
        }
        if (stat.fifties !== undefined)
        {
            total += parseInt(stat.fifties);
        }

        if (total == 0)
        {
            val = 0;
        }
        else
        {
            if (index == "10")
            {
                if (stat.teens === undefined)
                {
                    val = 0;
                }
                else
                {
                    val = stat.teens/total;
                }
            }
            if (index == "20")
            {
                if (stat.twenties === undefined)
                {
                    val = 0;
                }
                else
                {
                    val = stat.twenties/total;
                }
            }
            if (index == "30")
            {
                if (stat.thirties === undefined)
                {
                    val = 0;
                }
                else
                {
                    val = stat.thirties/total;
                }
            }
            if (index == "40")
            {
                if (stat.forties === undefined)
                {
                    val = 0;
                }
                else
                {
                    val = stat.forties/total;
                }
            }
            if (index == "50")
            {
                if (stat.fifties === undefined)
                {
                    val = 0;
                }
                else
                {
                    val = stat.fifties/total;
                }
            }
        }
        if (type == "padding")
        {
            return $rootScope.stat_height - $rootScope.stat_label_height - ($rootScope.stat_height - $rootScope.stat_label_height)*val;
        }
        else if (type == "block")
        {
            return ($rootScope.stat_height - $rootScope.stat_label_height)*val;
        }
    };
    $rootScope.getStatAgeBlockColor = function(stat, index) {
        if (stat === undefined || stat.length == 0)
        {
            return "other";
        }
        stat = stat[0];

        var age = "10";
        var count = 0;
        var total = 0;
        if (stat.teens !== undefined)
        {
            total += parseInt(stat.teens);
        }
        if (stat.twenties !== undefined)
        {
            total += parseInt(stat.twenties);
        }
        if (stat.thirties !== undefined)
        {
            total += parseInt(stat.thirties);
        }
        if (stat.forties !== undefined)
        {
            total += parseInt(stat.forties);
        }
        if (stat.fifties !== undefined)
        {
            total += parseInt(stat.fifties);
        }

        if (stat.teens !== undefined && parseInt(stat.teens) > count)
        {
            age = "10";
            count = parseInt(stat.teens);
        }
        if (stat.twenties !== undefined && parseInt(stat.twenties) > count)
        {
            age = "20";
            count = parseInt(stat.twenties);
        }
        if (stat.thirties !== undefined && parseInt(stat.thirties) > count)
        {
            age = "30";
            count = parseInt(stat.thirties);
        }
        if (stat.forties !== undefined && parseInt(stat.forties) > count)
        {
            age = "40";
            count = parseInt(stat.forties);
        }
        if (stat.fifties !== undefined && parseInt(stat.fifties) > count)
        {
            age = "50";
            count = parseInt(stat.fifties);
        }

        if (age == index)
        {
            return "top";
        }
        else
        {
            return "other";
        }
    };

    $rootScope.openOthersProfileMenu = function(){
        // Show the action sheet
        $ionicActionSheet.show({
            buttons: [
                { text: '<span class="assertive">Block User</span>' },
                { text: '<span class="assertive">Report</span>' }
            ],
            cancelText: 'Cancel',
            cancel: function() {
                // code for cancel if necessary.
            },
            buttonClicked: function(index) {
                switch (index){
                    case 0 :
                        var confirmPopup = $ionicPopup.confirm({
                            title: 'Block',
                            template: 'Are you sure you want to block this user?'
                        });

                        confirmPopup.then(function(res) {
                            if(res) {
                                $ionicLoading.show();
                                $http.post($rootScope.baseURL+'/api/user/'+$stateParams.accountSlug+'/block').success(function(){
                                    $ionicLoading.hide();
                                    return true;
                                })
                                .error(function(data, status){
                                    $rootScope.handleHttpError(data, status);
                                });
                            }
                        });
                        return true;
                    case 1 :
                        var confirmPopup = $ionicPopup.confirm({
                            title: 'Report',
                            template: 'Are you sure you want to report this user?'
                        });

                        confirmPopup.then(function(res) {
                            if(res) {
                                $ionicLoading.show();
                                $http.post($rootScope.baseURL+'/api/user/'+$stateParams.accountSlug+'/report').success(function(){
                                    $ionicLoading.hide();
                                    return true;
                                })
                                .error(function(data, status){
                                    $rootScope.handleHttpError(data, status);
                                });
                            }
                        });
                        return true;
                }
            }
        });
    };
    $rootScope.lastScrolling = new Date().getTime();
    $rootScope.scrollList = function() {
        $rootScope.lastScrolling = new Date().getTime();
    };
    $rootScope.canClickInList = function() {
        return true;
        var diff =  new Date().getTime() - $rootScope.lastScrolling;
        if (diff > 200) {
            return true;
        } else {
            return false;
        }
    };
    $rootScope.toggleLike = function($event,comment){
        $event.preventDefault();
        if(comment.user_liked){
            $http.get($rootScope.baseURL+'/api/comment/'+comment.id+'/unlike').success(function(){
            })
            .error(function(data, status){
                $rootScope.handleHttpError(data, status);
            });
            comment.like_count--;
        }
        else{
            $http.get($rootScope.baseURL+'/api/comment/'+comment.id+'/like').success(function(){
            })
            .error(function(data, status){
                $rootScope.handleHttpError(data, status);
            });
            comment.like_count++;
        }
        //$rootScope.trackAndUpdateLike(comment);
        comment.user_liked = !comment.user_liked;
    };
    $rootScope.trackAndUpdateLike = function(post){
        for(i = 0; i < $rootScope.postTrackArray.length; i++){
            thisPost = $rootScope.postTrackArray[i];
            if(post.id == thisPost.id){
                if(thisPost.user_liked){
                    thisPost.likes_count.aggregate--;
                    if(thisPost.likes_count.aggregate == 0){
                        thisPost.likes_count = null;
                    }
                }
                else{
                    if(thisPost.likes_count){
                        thisPost.likes_count.aggregate++;
                    }
                    else{
                        thisPost.likes_count = {aggregate: 1};
                    }
                }
                thisPost.user_liked = !thisPost.user_liked;
            }
        }
    }
    $rootScope.likesCount = function(post){
        if(post.likes_count){
            return post.likes_count.aggregate;
        }
        else{
            return 0;
        }
    }
    $rootScope.cloneObj = function(obj) {
      return JSON.parse(JSON.stringify(obj));
    }
    $rootScope.indexOfObj = function(arr, obj) {
        for (var i = 0; i < arr.length; i++) {
            if (arr[i].id == obj.id) {
                return i;
            }
        }
        return -1;
    }
    $rootScope.isStatNotAvailable = function(post) {
        return post.post_analytic == undefined ||
            post.post_analytic.length == 0 ||
            (
                post.post_analytic[0].male == 0 &&
                post.post_analytic[0].female == 0
            )
    }
    $rootScope.toggleFollow = function(user) {
        var current_user = $rootScope.getCurrentUser();
        if(user.following_check){
            $http.get($rootScope.baseURL+'/api/user/'+ user.slug +'/unfollow').success(function(){
                current_user.following_count--;
            })
            .error(function(data, status){
                $rootScope.handleHttpError(data, status);
            });
        }
        else{
            $http.get($rootScope.baseURL+'/api/user/'+ user.slug +'/follow').success(function(){
                current_user.following_count++;
            })
            .error(function(data, status){
                $rootScope.handleHttpError(data, status);
            });
        }
        BusinessObjectStateSync.toggleFollow(user);
    };

    $rootScope.getNotification = function(_notificationPullInterval = null) {
        var user = $rootScope.getCurrentUser();
        if (typeof user !== 'undefined'){
            notificationPullInterval = _notificationPullInterval;
            if (notificationPullInterval == null)
            {
                notificationPullInterval = $rootScope.notificationPullInterval;
            }
            FetchNotifications.stateChanged(user.slug, notificationPullInterval).then(function(response){
                if (response != "fail")
                {
                    $rootScope.notificationCount = (response >= 10 ? "9+" : (response ? response : 0));
                }
            });
        }
    }

    $rootScope.goNotification = function() {
        var user = $rootScope.getCurrentUser();
        $http.get($rootScope.baseURL+'/api/user/'+user.slug+'/notification/open').success(function(){
            $rootScope.notificationCount = "0";
        })
        .error(function(data, status){
            $rootScope.handleHttpError(data, status);
        });
        $state.go('tab.notification');
    }
    $rootScope.ifInNotification = function() {
        var detect = 'auth, forgetpassword, register, register2, root, intro';
        if( detect.indexOf($state.current.name) > -1 || $state.current.name.indexOf('notification') > -1){
            return true;
        }
        return false;
    }
    $rootScope.openInAppBrowser = function(url) {
        cordova.InAppBrowser.open(url, '_blank');
    }
    $rootScope.renderFirstView = function() {
        if(! DeepLink.openIfStashed()){
            $state.go('tab.explore-explore');
        }
    }

    setInterval(function() {
        if($rootScope.currentUser){
            FCMHandler.registerNewToken();
        }
    }, 1000);
})
.controller('CanvasCtrl', function($scope, $rootScope, $http, $ionicLoading, DuelService, $ionicHistory, $state, CanvasService){
    $scope.canvasService = CanvasService;

    CanvasService.render();

    $scope.save = function() {
        CanvasService.clearSelection();
        var canvas = document.getElementById( 'c' );
        $ionicLoading.show();

        $http.post($rootScope.baseURL+'/api/photo/temp', {
            imgBase64: canvas.toDataURL()
        }).success(function(result){
            $ionicLoading.hide();
            DuelService.setPicture(DuelService.getCurrentPictureIndex(), $rootScope.baseURL+result, false);
            DuelService.setPictureState(DuelService.getCurrentPictureIndex(), CanvasService.toJSON());
            CanvasService.reset();
            $ionicHistory.nextViewOptions({
                disableBack: true
            });
            $state.go('tab.post-create-step-2', {refresh : new Date().getTime()});
        })
        .error(function(data, status){
            $ionicLoading.hide();
            $rootScope.handleHttpError(data, status);
        });
    }

    $scope.wardrobe = function() {
        $state.go('tab.wardrobe');
    }

    $scope.clear = function() {
        CanvasService.clear();
    }
})
.controller('CanvasDemoCtrl', function(CanvasService, $interval){
    var _canvas = new fabric.Canvas('c');
    _canvas.backgroundColor = '#f7f7f7';
    _canvas.setHeight(window.innerWidth * 1.33);
    _canvas.setWidth(window.innerWidth);
    var image_array = [
        'img/feature/demo/1.jpg',
        'img/feature/demo/2.jpg',
        'img/feature/demo/3.jpg',
        'img/feature/demo/4.jpg',
        'img/feature/demo/5.jpg',
        'img/feature/demo/6.jpg',
        'img/feature/demo/7.jpg',
        'img/feature/demo/8.jpg',
        'img/feature/demo/9.jpg',
        'img/feature/demo/10.jpg',
        'img/feature/demo/11.jpg',
        'img/feature/demo/12.jpg',
        'img/feature/demo/13.jpg',
        'img/feature/demo/14.jpg',
        'img/feature/demo/15.jpg',
    ];
    var index = 0;
    var dummy = $interval(function(){
        fabric.Image.fromURL(image_array[index], function(img) {
          img.set({
              scaleX: _canvas.width / img.width,
              scaleY: _canvas.height / img.height,
              top: 0,
              left: 0,
              originX: 'left',
              originY: 'top'
          });
          _canvas.add(img);
          _canvas.renderAll.bind(_canvas);
          console.log(img);
        }, {crossOrigin: 'Anonymous'});
        index++;
        if(index == image_array.length){
            $interval.cancel(dummy);
        }
    }, 300);
})
.controller('WardrobeDemoCtrl', function($scope, CanvasService){
    $scope.data =
    {
      "item_array": [
        {
          "key": "product_1577304601106",
          "product": {
            "name": "Old Skool Platform - Black",
            "description": "Do we even need to tell you about these shoes? Old Skool Vans are basically a wardrobe staple at this point. They’re classic. Like blue jeans…or cool ranch Doritos…or the Lizzie McGuire movie. Their greatness is just common knowledge. This pair is a classic black with a platform sole that’ll give you just a little extra lift.\n\nthe details -\n\nClassic side stripe skate shoe with sturdy canvas and suede uppers\nRe-enforced toecaps to withstand repeated wear, padded collars for support and flexibility, and platform signature rubber waffle outsoles\n\nFree Returns +\n\nYou have 30 days to return anything you’re unhappy with. Exceptions include personalized items and items marked as final sale. You’ll receive a free prepaid shipping label once your return is authorized.\n\nGet more info here.",
            "mainImage": "https://cdn.shopify.com/s/files/1/0787/5255/products/01_bando-3p-vans-UAoldskoolplatform-black-01_9ae53317-0d3a-4bd3-b4fb-48092dfcfd12_1024x1024.jpg?v=1575932030",
            "images": [
              "https://cdn.shopify.com/s/files/1/0787/5255/products/02_On-Figure-Shoes-26140_1_100x.jpg?v=1575932030",
              "https://cdn.shopify.com/s/files/1/0787/5255/products/02_On-Figure-Shoes-26140_1_1024x1024.jpg?v=1575932030",
              "https://cdn.shopify.com/s/files/1/0787/5255/products/01_bando-3p-vans-UAoldskoolplatform-black-01_9ae53317-0d3a-4bd3-b4fb-48092dfcfd12_1024x1024.jpg?v=1575932030",
              "https://cdn.shopify.com/s/files/1/0787/5255/products/03_bando-3p-vans-UAoldskoolplatform-black-02_100x.jpg?v=1575932030",
              "https://cdn.shopify.com/s/files/1/0787/5255/products/03_bando-3p-vans-UAoldskoolplatform-black-02_1024x1024.jpg?v=1575932030"
            ],
            "url": "https://www.bando.com/products/old-skool-platform-black?variant=12167311982666&gclid=Cj0KCQiArozwBRDOARIsAHo2s7seKsGpsMaMTeNtPUlcNs57DTGRsFjNXvxdVAj-cQESWspLnPpSUrYaAkL_EALw_wcB",
            "additionalProperty": [
              {
                "name": "style",
                "value": "black"
              }
            ],
            "offers": [
              {
                "price": "65.0",
                "currency": "USD",
                "availability": "InStock"
              }
            ],
            "sku": "GP-88094",
            "brand": "vans",
            "probability": 0.9813618,
            "mpn": "GP-88094",
            "aggregateRating": {
              "ratingValue": 5,
              "reviewCount": 5
            }
          },
          "image": "https://cdn.shopify.com/s/files/1/0787/5255/products/01_bando-3p-vans-UAoldskoolplatform-black-01_9ae53317-0d3a-4bd3-b4fb-48092dfcfd12_1024x1024.jpg?v=1575932030",
          "query": {
            "id": "1577304602176-05372879671832b3",
            "domain": "bando.com",
            "userQuery": {
              "url": "https://www.bando.com/products/old-skool-platform-black?variant=12167311982666&gclid=Cj0KCQiArozwBRDOARIsAHo2s7seKsGpsMaMTeNtPUlcNs57DTGRsFjNXvxdVAj-cQESWspLnPpSUrYaAkL_EALw_wcB",
              "pageType": "product"
            }
          },
          "$$hashKey": "object:313"
        },
        {
          "key": "product_1577304003863",
          "product": {
            "name": "contrast logo denim jacket",
            "description": "Born from the antithesis between streetwear and high fashion, Off-White set out to combine both. Mainly inspired by the youth culture, Off-White creates statement pieces with a distinctive aesthetic, expect punchy prints, graphic lines and laidback designs, as seen in this black cotton contrast embroidered logo denim jacket. Featuring two front pockets, a front button fastening, a branded rear patch, an embroidered fuchsia arrow logo at the front, a white lettering stamp at the hem, a contrasting white stitching and two slit side pockets.",
            "mainImage": "https://cdn-images.farfetch-contents.com/14/07/71/33/14077133_18776035_1000.jpg",
            "images": [
              "https://cdn-images.farfetch-contents.com/14/07/71/33/14077133_18776035_1000.jpg",
              "https://cdn-images.farfetch-contents.com/14/07/71/33/14077133_18776036_1000.jpg"
            ],
            "url": "https://www.farfetch.com/shopping/men/off-white-contrast-logo-denim-jacket-item-14077133.aspx?fsb=1&size=22&storeid=9352&utm_source=google&utm_medium=cpc&utm_keywordid=119358777&utm_shoppingproductid=14077133-8876&pid=google_search&af_channel=Search&c=2069781564&af_c_id=2069781564&af_siteid=&af_keywords=aud-331385746483:pla-423132148206&af_adset_id=79320100034&af_ad_id=277393252784&af_sub1=119358777&af_sub5=14077133-8876&is_retargeting=true&shopping=yes&gclid=Cj0KCQiArozwBRDOARIsAHo2s7t4edmSxA_-giayDjpAuT4Cyiu9XjqActJgq5xNUw7-zTtNwp5AZ6kaAmp5EALw_wcB",
            "additionalProperty": [
              {
                "name": "designer style id",
                "value": "OMYE019T19812081"
              },
              {
                "name": "lining",
                "value": "Polyester 65%, Cotton 35%"
              },
              {
                "name": "the model is also styled with",
                "value": "Off-White unfinished slim sweatpants, Off-White signature graphic print T-shirt."
              }
            ],
            "offers": [
              {
                "price": "710.0",
                "currency": "USD",
                "availability": "InStock"
              }
            ],
            "sku": "OMYE019T19812081",
            "breadcrumbs": [
              {
                "name": "Sale: 6000 items at up to 60% off",
                "link": "https://www.farfetch.com/shopping/men/sale/all/items.aspx"
              }
            ],
            "probability": 0.9814771
          },
          "image": "https://cdn-images.farfetch-contents.com/14/07/71/33/14077133_18776035_1000.jpg",
          "query": {
            "id": "1577304004787-03edcdc96a219a3a",
            "domain": "farfetch.com",
            "userQuery": {
              "url": "https://www.farfetch.com/shopping/men/off-white-contrast-logo-denim-jacket-item-14077133.aspx?fsb=1&size=22&storeid=9352&utm_source=google&utm_medium=cpc&utm_keywordid=119358777&utm_shoppingproductid=14077133-8876&pid=google_search&af_channel=Search&c=2069781564&af_c_id=2069781564&af_siteid=&af_keywords=aud-331385746483:pla-423132148206&af_adset_id=79320100034&af_ad_id=277393252784&af_sub1=119358777&af_sub5=14077133-8876&is_retargeting=true&shopping=yes&gclid=Cj0KCQiArozwBRDOARIsAHo2s7t4edmSxA_-giayDjpAuT4Cyiu9XjqActJgq5xNUw7-zTtNwp5AZ6kaAmp5EALw_wcB",
              "pageType": "product"
            }
          },
          "$$hashKey": "object:219"
        },
        {
          "key": "product_1577303363945",
          "product": {
            "name": "ripped stonewashed skinny jeans",
            "description": "The Details\n\nRtA\n\nripped stonewashed skinny jeans\n\nBlack cotton-blend ripped stonewashed skinny jeans from RtA featuring a stonewashed effect, a five pocket design, a high rise, a waistband with belt loops, a button and zip fly, a skinny style, ripped details and a faded effect.\n\nMade in United States\n\nComposition\n\nCotton 98%, Polyurethane 2%\n\nWashing instructions\n\nMachine Wash\n\nDesigner Style ID: WH8171131CONT\n\nWearing\n\nModel is 5 ft 10 in wearing size (Waist)\n\nSize & Fit\n\nCentimeters\nInches\n\nModel Measurements\n\nheight: 5 ft 10 in\nbust/Chest: 31.9 in\nhips: 33.9 in\nwaist: 24 in\n\nModel's wearing (Waist)",
            "mainImage": "https://cdn-images.farfetch-contents.com/13/65/67/17/13656717_16526635_1000.jpg",
            "images": [
              "https://cdn-images.farfetch-contents.com/13/65/67/17/13656717_16526633_1000.jpg",
              "https://cdn-images.farfetch-contents.com/13/65/67/17/13656717_16526635_1000.jpg"
            ],
            "url": "https://www.farfetch.com/shopping/women/rta-ripped-stonewashed-skinny-jeans-item-13656717.aspx?fsb=1&size=20&storeid=9889&utm_source=google&utm_medium=cpc&utm_keywordid=119356676&utm_shoppingproductid=13656717-5053&pid=google_search&af_channel=Search&c=2069920048&af_c_id=2069920048&af_siteid=&af_keywords=pla-414511222974&af_adset_id=75217631014&af_ad_id=273078362075&af_sub1=119356676&af_sub5=13656717-5053&is_retargeting=true&shopping=yes&gclid=Cj0KCQiArozwBRDOARIsAHo2s7uvA6YLR0UHHmZ0MmZuEDoXbciEbJjb80l1lBEexIHBjyDQ3WTdXfAaAt6OEALw_wcB",
            "offers": [
              {
                "price": "365.0",
                "currency": "USD",
                "availability": "InStock",
                "regularPrice": "521.0"
              }
            ],
            "sku": "WH8171131CONT",
            "breadcrumbs": [
              {
                "name": "home",
                "link": "https://www.farfetch.com/"
              },
              {
                "name": "Women",
                "link": "https://www.farfetch.com/shopping/women/items.aspx"
              },
              {
                "name": "RtA",
                "link": "https://www.farfetch.com/shopping/women/rta/items.aspx"
              },
              {
                "name": "Clothing",
                "link": "https://www.farfetch.com/shopping/women/rta/clothing-1/items.aspx"
              },
              {
                "name": "Skinny Jeans",
                "link": "https://www.farfetch.com/shopping/women/rta/skinny-denim-1/items.aspx"
              },
              {
                "name": "ripped stonewashed skinny jeans"
              }
            ],
            "probability": 0.97937244
          },
          "image": "https://cdn-images.farfetch-contents.com/13/65/67/17/13656717_16526633_1000.jpg",
          "query": {
            "id": "1577303365148-d2e5fe4303612762",
            "domain": "farfetch.com",
            "userQuery": {
              "url": "https://www.farfetch.com/shopping/women/rta-ripped-stonewashed-skinny-jeans-item-13656717.aspx?fsb=1&size=20&storeid=9889&utm_source=google&utm_medium=cpc&utm_keywordid=119356676&utm_shoppingproductid=13656717-5053&pid=google_search&af_channel=Search&c=2069920048&af_c_id=2069920048&af_siteid=&af_keywords=pla-414511222974&af_adset_id=75217631014&af_ad_id=273078362075&af_sub1=119356676&af_sub5=13656717-5053&is_retargeting=true&shopping=yes&gclid=Cj0KCQiArozwBRDOARIsAHo2s7uvA6YLR0UHHmZ0MmZuEDoXbciEbJjb80l1lBEexIHBjyDQ3WTdXfAaAt6OEALw_wcB",
              "pageType": "product"
            }
          },
          "$$hashKey": "object:220"
        },
        {
          "key": "product_1577302692256",
          "product": {
            "name": "Comme des Garcons Play Long Sleeve Heart Logo Stripe Tee",
            "description": "Buy the Comme des Garcons Play Long Sleeve Heart Logo Stripe Tee in Black & White from leading mens fashion retailer END. - only $125. Fast shipping on all latest Comme des Garçons Play products",
            "mainImage": "https://media.endclothing.com/media/f_auto,q_auto:eco/prodmedia/media/catalog/product/1/5/15-04-2019_commedesgarcons_playlongsleeveheartlogostripetee_blackwhite_p1t164-1_bb_1.jpg",
            "images": [
              "https://media.endclothing.com/media/f_auto,q_auto:eco/prodmedia/media/catalog/product/1/5/15-04-2019_commedesgarcons_playlongsleeveheartlogostripetee_blackwhite_p1t164-1_bb_2.jpg"
            ],
            "url": "https://www.endclothing.com/us/comme-des-garcons-play-long-sleeve-heart-logo-stripe-tee-p1t164-1.html?173=small&gclid=Cj0KCQiArozwBRDOARIsAHo2s7twvVT32r1goCpXzfVz4Cmm0W0oyFffpv30vSnU6_EwqIyVQGqLkrsaAqXWEALw_wcB",
            "offers": [
              {
                "price": "125.0",
                "currency": "USD",
                "availability": "InStock"
              }
            ],
            "sku": "P1T164-1",
            "breadcrumbs": [
              {
                "name": "Home",
                "link": "https://www.endclothing.com/us/"
              },
              {
                "name": "Brands",
                "link": "https://www.endclothing.com/us/brands"
              },
              {
                "name": "Comme des Garçons Play",
                "link": "https://www.endclothing.com/us/brands/comme-des-garcons-play"
              },
              {
                "name": "Comme des Garcons Play Long Sleeve Heart Logo Stripe Tee",
                "link": "https://www.endclothing.com/us/comme-des-garcons-play-long-sleeve-heart-logo-stripe-tee-p1t164-1.html"
              }
            ],
            "probability": 0.50174505
          },
          "image": "https://media.endclothing.com/media/f_auto,q_auto:eco/prodmedia/media/catalog/product/1/5/15-04-2019_commedesgarcons_playlongsleeveheartlogostripetee_blackwhite_p1t164-1_bb_1.jpg",
          "query": {
            "id": "1577302693307-556d10e432b0ed9c",
            "domain": "endclothing.com",
            "userQuery": {
              "url": "https://www.endclothing.com/us/comme-des-garcons-play-long-sleeve-heart-logo-stripe-tee-p1t164-1.html?173=small&gclid=Cj0KCQiArozwBRDOARIsAHo2s7twvVT32r1goCpXzfVz4Cmm0W0oyFffpv30vSnU6_EwqIyVQGqLkrsaAqXWEALw_wcB",
              "pageType": "product"
            }
          },
          "$$hashKey": "object:221"
        }
      ],
      "processing_item_array": [
      ]
    }
    $scope.selected_item_array = [];

    $scope.toggleSelect = function(item) {
        if(item.selected == true){
            item.selected = false;
            var arr = $scope.selected_item_array;
            for( var i = 0; i < arr.length; i++){
               if ( arr[i].image === item.image) {
                 arr.splice(i, 1);
               }
            }
        }
        else{
            item.selected = true;
            $scope.selected_item_array.push(item);
        }
    }

    $scope.load = function() {
        if($scope.selected_item_array.length == 0){
            $rootScope.popupMessage('','Please select one or more items');
        }
        else{
            CanvasService.loadItems($scope.selected_item_array);
        }
    }
})
.controller('WardrobeAddDemoCtrl', function($scope, $timeout){
    $scope.data =
    {
      "item_array": [
        {
          "key": "product_1577304003863",
          "product": {
            "name": "contrast logo denim jacket",
            "description": "Born from the antithesis between streetwear and high fashion, Off-White set out to combine both. Mainly inspired by the youth culture, Off-White creates statement pieces with a distinctive aesthetic, expect punchy prints, graphic lines and laidback designs, as seen in this black cotton contrast embroidered logo denim jacket. Featuring two front pockets, a front button fastening, a branded rear patch, an embroidered fuchsia arrow logo at the front, a white lettering stamp at the hem, a contrasting white stitching and two slit side pockets.",
            "mainImage": "https://cdn-images.farfetch-contents.com/14/07/71/33/14077133_18776035_1000.jpg",
            "images": [
              "https://cdn-images.farfetch-contents.com/14/07/71/33/14077133_18776035_1000.jpg",
              "https://cdn-images.farfetch-contents.com/14/07/71/33/14077133_18776036_1000.jpg"
            ],
            "url": "https://www.farfetch.com/shopping/men/off-white-contrast-logo-denim-jacket-item-14077133.aspx?fsb=1&size=22&storeid=9352&utm_source=google&utm_medium=cpc&utm_keywordid=119358777&utm_shoppingproductid=14077133-8876&pid=google_search&af_channel=Search&c=2069781564&af_c_id=2069781564&af_siteid=&af_keywords=aud-331385746483:pla-423132148206&af_adset_id=79320100034&af_ad_id=277393252784&af_sub1=119358777&af_sub5=14077133-8876&is_retargeting=true&shopping=yes&gclid=Cj0KCQiArozwBRDOARIsAHo2s7t4edmSxA_-giayDjpAuT4Cyiu9XjqActJgq5xNUw7-zTtNwp5AZ6kaAmp5EALw_wcB",
            "additionalProperty": [
              {
                "name": "designer style id",
                "value": "OMYE019T19812081"
              },
              {
                "name": "lining",
                "value": "Polyester 65%, Cotton 35%"
              },
              {
                "name": "the model is also styled with",
                "value": "Off-White unfinished slim sweatpants, Off-White signature graphic print T-shirt."
              }
            ],
            "offers": [
              {
                "price": "710.0",
                "currency": "USD",
                "availability": "InStock"
              }
            ],
            "sku": "OMYE019T19812081",
            "breadcrumbs": [
              {
                "name": "Sale: 6000 items at up to 60% off",
                "link": "https://www.farfetch.com/shopping/men/sale/all/items.aspx"
              }
            ],
            "probability": 0.9814771
          },
          "image": "https://cdn-images.farfetch-contents.com/14/07/71/33/14077133_18776035_1000.jpg",
          "query": {
            "id": "1577304004787-03edcdc96a219a3a",
            "domain": "farfetch.com",
            "userQuery": {
              "url": "https://www.farfetch.com/shopping/men/off-white-contrast-logo-denim-jacket-item-14077133.aspx?fsb=1&size=22&storeid=9352&utm_source=google&utm_medium=cpc&utm_keywordid=119358777&utm_shoppingproductid=14077133-8876&pid=google_search&af_channel=Search&c=2069781564&af_c_id=2069781564&af_siteid=&af_keywords=aud-331385746483:pla-423132148206&af_adset_id=79320100034&af_ad_id=277393252784&af_sub1=119358777&af_sub5=14077133-8876&is_retargeting=true&shopping=yes&gclid=Cj0KCQiArozwBRDOARIsAHo2s7t4edmSxA_-giayDjpAuT4Cyiu9XjqActJgq5xNUw7-zTtNwp5AZ6kaAmp5EALw_wcB",
              "pageType": "product"
            }
          },
          "$$hashKey": "object:219"
        },
        {
          "key": "product_1577303363945",
          "product": {
            "name": "ripped stonewashed skinny jeans",
            "description": "The Details\n\nRtA\n\nripped stonewashed skinny jeans\n\nBlack cotton-blend ripped stonewashed skinny jeans from RtA featuring a stonewashed effect, a five pocket design, a high rise, a waistband with belt loops, a button and zip fly, a skinny style, ripped details and a faded effect.\n\nMade in United States\n\nComposition\n\nCotton 98%, Polyurethane 2%\n\nWashing instructions\n\nMachine Wash\n\nDesigner Style ID: WH8171131CONT\n\nWearing\n\nModel is 5 ft 10 in wearing size (Waist)\n\nSize & Fit\n\nCentimeters\nInches\n\nModel Measurements\n\nheight: 5 ft 10 in\nbust/Chest: 31.9 in\nhips: 33.9 in\nwaist: 24 in\n\nModel's wearing (Waist)",
            "mainImage": "https://cdn-images.farfetch-contents.com/13/65/67/17/13656717_16526635_1000.jpg",
            "images": [
              "https://cdn-images.farfetch-contents.com/13/65/67/17/13656717_16526633_1000.jpg",
              "https://cdn-images.farfetch-contents.com/13/65/67/17/13656717_16526635_1000.jpg"
            ],
            "url": "https://www.farfetch.com/shopping/women/rta-ripped-stonewashed-skinny-jeans-item-13656717.aspx?fsb=1&size=20&storeid=9889&utm_source=google&utm_medium=cpc&utm_keywordid=119356676&utm_shoppingproductid=13656717-5053&pid=google_search&af_channel=Search&c=2069920048&af_c_id=2069920048&af_siteid=&af_keywords=pla-414511222974&af_adset_id=75217631014&af_ad_id=273078362075&af_sub1=119356676&af_sub5=13656717-5053&is_retargeting=true&shopping=yes&gclid=Cj0KCQiArozwBRDOARIsAHo2s7uvA6YLR0UHHmZ0MmZuEDoXbciEbJjb80l1lBEexIHBjyDQ3WTdXfAaAt6OEALw_wcB",
            "offers": [
              {
                "price": "365.0",
                "currency": "USD",
                "availability": "InStock",
                "regularPrice": "521.0"
              }
            ],
            "sku": "WH8171131CONT",
            "breadcrumbs": [
              {
                "name": "home",
                "link": "https://www.farfetch.com/"
              },
              {
                "name": "Women",
                "link": "https://www.farfetch.com/shopping/women/items.aspx"
              },
              {
                "name": "RtA",
                "link": "https://www.farfetch.com/shopping/women/rta/items.aspx"
              },
              {
                "name": "Clothing",
                "link": "https://www.farfetch.com/shopping/women/rta/clothing-1/items.aspx"
              },
              {
                "name": "Skinny Jeans",
                "link": "https://www.farfetch.com/shopping/women/rta/skinny-denim-1/items.aspx"
              },
              {
                "name": "ripped stonewashed skinny jeans"
              }
            ],
            "probability": 0.97937244
          },
          "image": "https://cdn-images.farfetch-contents.com/13/65/67/17/13656717_16526633_1000.jpg",
          "query": {
            "id": "1577303365148-d2e5fe4303612762",
            "domain": "farfetch.com",
            "userQuery": {
              "url": "https://www.farfetch.com/shopping/women/rta-ripped-stonewashed-skinny-jeans-item-13656717.aspx?fsb=1&size=20&storeid=9889&utm_source=google&utm_medium=cpc&utm_keywordid=119356676&utm_shoppingproductid=13656717-5053&pid=google_search&af_channel=Search&c=2069920048&af_c_id=2069920048&af_siteid=&af_keywords=pla-414511222974&af_adset_id=75217631014&af_ad_id=273078362075&af_sub1=119356676&af_sub5=13656717-5053&is_retargeting=true&shopping=yes&gclid=Cj0KCQiArozwBRDOARIsAHo2s7uvA6YLR0UHHmZ0MmZuEDoXbciEbJjb80l1lBEexIHBjyDQ3WTdXfAaAt6OEALw_wcB",
              "pageType": "product"
            }
          },
          "$$hashKey": "object:220"
        },
        {
          "key": "product_1577302692256",
          "product": {
            "name": "Comme des Garcons Play Long Sleeve Heart Logo Stripe Tee",
            "description": "Buy the Comme des Garcons Play Long Sleeve Heart Logo Stripe Tee in Black & White from leading mens fashion retailer END. - only $125. Fast shipping on all latest Comme des Garçons Play products",
            "mainImage": "https://media.endclothing.com/media/f_auto,q_auto:eco/prodmedia/media/catalog/product/1/5/15-04-2019_commedesgarcons_playlongsleeveheartlogostripetee_blackwhite_p1t164-1_bb_1.jpg",
            "images": [
              "https://media.endclothing.com/media/f_auto,q_auto:eco/prodmedia/media/catalog/product/1/5/15-04-2019_commedesgarcons_playlongsleeveheartlogostripetee_blackwhite_p1t164-1_bb_2.jpg"
            ],
            "url": "https://www.endclothing.com/us/comme-des-garcons-play-long-sleeve-heart-logo-stripe-tee-p1t164-1.html?173=small&gclid=Cj0KCQiArozwBRDOARIsAHo2s7twvVT32r1goCpXzfVz4Cmm0W0oyFffpv30vSnU6_EwqIyVQGqLkrsaAqXWEALw_wcB",
            "offers": [
              {
                "price": "125.0",
                "currency": "USD",
                "availability": "InStock"
              }
            ],
            "sku": "P1T164-1",
            "breadcrumbs": [
              {
                "name": "Home",
                "link": "https://www.endclothing.com/us/"
              },
              {
                "name": "Brands",
                "link": "https://www.endclothing.com/us/brands"
              },
              {
                "name": "Comme des Garçons Play",
                "link": "https://www.endclothing.com/us/brands/comme-des-garcons-play"
              },
              {
                "name": "Comme des Garcons Play Long Sleeve Heart Logo Stripe Tee",
                "link": "https://www.endclothing.com/us/comme-des-garcons-play-long-sleeve-heart-logo-stripe-tee-p1t164-1.html"
              }
            ],
            "probability": 0.50174505
          },
          "image": "https://media.endclothing.com/media/f_auto,q_auto:eco/prodmedia/media/catalog/product/1/5/15-04-2019_commedesgarcons_playlongsleeveheartlogostripetee_blackwhite_p1t164-1_bb_1.jpg",
          "query": {
            "id": "1577302693307-556d10e432b0ed9c",
            "domain": "endclothing.com",
            "userQuery": {
              "url": "https://www.endclothing.com/us/comme-des-garcons-play-long-sleeve-heart-logo-stripe-tee-p1t164-1.html?173=small&gclid=Cj0KCQiArozwBRDOARIsAHo2s7twvVT32r1goCpXzfVz4Cmm0W0oyFffpv30vSnU6_EwqIyVQGqLkrsaAqXWEALw_wcB",
              "pageType": "product"
            }
          },
          "$$hashKey": "object:221"
        }
      ],
      "processing_item_array": [
          {
              "key": "product_1577304601106",
              "image": 'img/processing-icon.png'
          }
      ]
    }
    $timeout(function(){
        $scope.data.processing_item_array.shift();
        $scope.data.item_array.unshift({
          "key": "product_1577304601106",
          "image": "https://cdn.shopify.com/s/files/1/0787/5255/products/01_bando-3p-vans-UAoldskoolplatform-black-01_9ae53317-0d3a-4bd3-b4fb-48092dfcfd12_1024x1024.jpg?v=1575932030"
        });
    },2000);
})
.controller('WardrobeCtrl', function($scope, $state, CanvasService, $http, $rootScope, $interval, WardrobeService, $ionicActionSheet, $ionicLoading){
    function requestProduct(){
        $http.post($rootScope.baseURL+'/api/product/index', {
            processing_item_array: $scope.data.processing_item_array
        })
        .success(function(response){
            WardrobeService.loadStateStr().then(function(state_str){
                $scope.data = JSON.parse(state_str);
                for(var i=0;i<response.length;i++){
                    for(var j=0;j<$scope.data.processing_item_array.length;j++){
                        if($scope.data.processing_item_array[j].key == response[i].key){
                            var returned_value = JSON.parse(response[i].value)[0];
                            if(typeof returned_value.requested === 'undefined'){
                                $scope.data.processing_item_array.splice(j,1);
                                if(
                                    typeof returned_value.product === "undefined" ||
                                    typeof returned_value.product.mainImage === "undefined"
                                ){
                                    $scope.data.item_array.unshift({
                                        key: response[i].key,
                                        error: true,
                                        image: 'img/oops.png',
                                        query: returned_value.query
                                    });
                                }
                                else{
                                    $scope.data.item_array.unshift({
                                        key: response[i].key,
                                        product: returned_value.product,
                                        image: returned_value.product.mainImage,
                                        query: returned_value.query
                                    });
                                }
                                WardrobeService.saveState($scope);
                            }
                        }
                    }
                }
                if ($scope.data.processing_item_array.length == 0) {
                    if(WardrobeService.keepRequestProduct != null){
                        $interval.cancel(WardrobeService.keepRequestProduct);
                        WardrobeService.keepRequestProduct = null;
                    }
                }
            });
        });
    }

    function keepRequestProduct(){
        if(WardrobeService.keepRequestProduct != null){
            $interval.cancel(WardrobeService.keepRequestProduct);
            WardrobeService.keepRequestProduct = null;
        }
        WardrobeService.keepRequestProduct = $interval(function(){
            requestProduct();
        }, 5000);
    }

    $scope.data = WardrobeService.getEmptyState();

    WardrobeService.loadStateStr().then(function(state_str){
        $scope.data = JSON.parse(state_str);
        if($scope.data.processing_item_array.length > 0){
            requestProduct();
            keepRequestProduct();
        }
    }, function(){
        $scope.data = {"item_array":[{"key":"product_1577578853709","product":{"name":"Aerie Ribbed Beanie Hat","description":"Cozy, warm ribbed fabric\nFold it as much (or as little) as you like to make it yours\nPop! Pretty specks of color\nStay warm!\nStyle: 5497-4162 | Color: 390","mainImage":"https://s7d2.scene7.com/is/image/aeo/5497_4162_390_f?$PDP-1910L$","images":["https://s7d2.scene7.com/is/image/aeo/5497_4162_390_b?$PDP-1910L$","https://s7d2.scene7.com/is/image/aeo/5497_4162_390_f?$PDP-1910L$","https://s7d2.scene7.com/is/image/aeo/5497_4162_390_f?$PDP-1910L$",null],"url":"https://www.ae.com/us/en/p/women/hats/beanies/aerie-ribbed-beanie-hat/5497_4162_390?menu=cat4840006","additionalProperty":[{"name":"blog","value":"AEO | Aerie"}],"offers":[{"price":"7.98","currency":"USD","availability":"InStock","regularPrice":"19.95"}],"sku":"5497-4162","brand":"Aerie","breadcrumbs":[{"name":"Women","link":"https://www.ae.com/us/en/c/women/womens"},{"name":"Accessories & Socks","link":"https://www.ae.com/us/en/c/women/accessories-socks/cat4840018"},{"name":"Hats","link":"https://www.ae.com/us/en/c/women/accessories-socks/hats/cat5400020"},{"name":"Beanies","link":"https://www.ae.com/us/en/c/women/hats/beanies/cat8130241"}],"probability":0.99223185},"image":"https://s7d2.scene7.com/is/image/aeo/5497_4162_390_f?$PDP-1910L$","query":{"id":"1577578855005-53ce3449995d1669","domain":"ae.com","userQuery":{"url":"https://www.ae.com/us/en/p/women/hats/beanies/aerie-ribbed-beanie-hat/5497_4162_390?menu=cat4840006","pageType":"product"}},"$$hashKey":"object:578"},{"key":"product_1577578758362","product":{"name":"EMU Australia Stinger Micro Boot","description":"These boots were made to keep you warm and stylish.","mainImage":"https://s7d2.scene7.com/is/image/aeo/7411_4687_217_d1?$PDP-1910L$","images":["https://s7d2.scene7.com/is/image/aeo/7411_4687_217_f?$PDP-1910L$","https://s7d2.scene7.com/is/image/aeo/7411_4687_217_d1?$PDP-1910L$","https://s7d2.scene7.com/is/image/aeo/7411_4687_217_b?$PDP-1910L$","https://s7d2.scene7.com/is/image/aeo/7411_4687_217_d1?$PDP-1910L$",null],"url":"https://www.ae.com/us/en/p/women/boots/booties/emu-australia-stinger-micro-boot/7411_4687_217?menu=cat4840004","additionalProperty":[{"name":"style: 7411","value":"4687 | Color: 217"}],"offers":[{"price":"119.95","currency":"USD","availability":"InStock"}],"sku":"7411-4687","brand":"Online Only","breadcrumbs":[{"name":"Women","link":"https://www.ae.com/us/en/c/women/womens"},{"name":"Shoes","link":"https://www.ae.com/us/en/c/women/shoes/cat4840020"},{"name":"Boots","link":"https://www.ae.com/us/en/c/women/shoes/boots/cat120147"},{"name":"Booties","link":"https://www.ae.com/us/en/c/women/boots/booties/cat6470546"}],"probability":0.99690825},"image":"https://s7d2.scene7.com/is/image/aeo/7411_4687_217_d1?$PDP-1910L$","query":{"id":"1577578759626-b23793c08415a798","domain":"ae.com","userQuery":{"url":"https://www.ae.com/us/en/p/women/boots/booties/emu-australia-stinger-micro-boot/7411_4687_217?menu=cat4840004","pageType":"product"}},"$$hashKey":"object:579"},{"key":"product_1577578717898","product":{"name":"Skinny Jean","description":"The ultimate \"cool girl\" fit made for every day.","mainImage":"https://s7d2.scene7.com/is/image/aeo/0432_1985_426_of?$PDP-1910L$","images":["https://s7d2.scene7.com/is/image/aeo/0432_1985_426_b?$PDP-1910L$","https://s7d2.scene7.com/is/image/aeo/0432_1985_426_d3?$PDP-1910L$","https://s7d2.scene7.com/is/image/aeo/0432_1985_426_f?$PDP-1910L$","https://s7d2.scene7.com/is/image/aeo/0432_1985_426_os?$PDP-1910L$","https://s7d2.scene7.com/is/image/aeo/0432_1985_426_ob?$PDP-1910L$","https://s7d2.scene7.com/is/image/aeo/0432_1985_426_of?$PDP-1910L$","https://s7d2.scene7.com/is/image/aeo/0432_1985_426_of?$PDP-1910L$",null],"url":"https://www.ae.com/us/en/p/women/skinny-jeans/skinny-jeans/skinny-jean/0432_1985_426?menu=cat4840004","additionalProperty":[{"name":"style: 0432","value":"1985 | Color: 426"}],"offers":[{"price":"37.46","currency":"USD","availability":"InStock","regularPrice":"49.95"}],"sku":"0432-1985","brand":"AE","breadcrumbs":[{"name":"Women","link":"https://www.ae.com/us/en/c/women/womens"},{"name":"Bottoms","link":"https://www.ae.com/us/en/c/women/bottoms/cat10051"},{"name":"Jeans","link":"https://www.ae.com/us/en/c/women/bottoms/jeans/cat6430042"},{"name":"Skinny Jeans","link":"https://www.ae.com/us/en/c/women/jeans/skinny-jeans/cat1990002"},{"name":"Skinny Jeans","link":"https://www.ae.com/us/en/c/women/jeans/skinny-jeans/skinny-jeans/cat370080"}],"probability":0.99671775},"image":"https://s7d2.scene7.com/is/image/aeo/0432_1985_426_f?$PDP-1910L$","query":{"id":"1577578719147-a6705696d9de80f2","domain":"ae.com","userQuery":{"url":"https://www.ae.com/us/en/p/women/skinny-jeans/skinny-jeans/skinny-jean/0432_1985_426?menu=cat4840004","pageType":"product"}},"$$hashKey":"object:580"},{"key":"product_1577578313648","product":{"name":"AE Mock Neck Boxy Cropped Sweater","description":"So cozy! This sweater is loose and cropped for a boxy fit we love. Make it yours.","mainImage":"https://s7d2.scene7.com/is/image/aeo/1341_8604_313_of?$PDP-1910L$","images":["https://s7d2.scene7.com/is/image/aeo/1341_8604_313_ob?$PDP-1910L$","https://s7d2.scene7.com/is/image/aeo/1341_8604_313_f?$PDP-1910L$","https://s7d2.scene7.com/is/image/aeo/1341_8604_313_b?$PDP-1910L$","https://s7d2.scene7.com/is/image/aeo/1341_8604_313_of?$PDP-1910L$","https://s7d2.scene7.com/is/image/aeo/1341_8604_313_of?$PDP-1910L$",null],"url":"https://www.ae.com/us/en/p/women/sweaters-cardigans/cropped-sweaters/ae-mock-neck-boxy-cropped-sweater/1341_8604_313?menu=cat4840004","additionalProperty":[{"name":"blog","value":"AEO | Aerie"},{"name":"style","value":"1341-8604 | Color: 313"}],"offers":[{"price":"29.96","currency":"USD","availability":"InStock","regularPrice":"39.95"}],"sku":"1341-8604","brand":"Online Only","breadcrumbs":[{"name":"Women","link":"https://www.ae.com/us/en/c/women/womens"},{"name":"Tops","link":"https://www.ae.com/us/en/c/women/tops/cat10049"},{"name":"Sweaters & Cardigans","link":"https://www.ae.com/us/en/c/women/tops/sweaters-cardigans/cat1410002"},{"name":"Cropped Sweaters","link":"https://www.ae.com/us/en/c/women/sweaters-cardigans/cropped-sweaters/cat670011"}],"probability":0.9946526},"image":"https://s7d2.scene7.com/is/image/aeo/1341_8604_313_f?$PDP-1910L$","query":{"id":"1577578314764-65a5f2413eb2d31c","domain":"ae.com","userQuery":{"url":"https://www.ae.com/us/en/p/women/sweaters-cardigans/cropped-sweaters/ae-mock-neck-boxy-cropped-sweater/1341_8604_313?menu=cat4840004","pageType":"product"}},"$$hashKey":"object:581"}],"processing_item_array":[]}
        WardrobeService.saveState($scope);
    });

    $scope.selected_item_array = [];

    $scope.toggleSelect = function(item) {
        if(typeof item.error !== "undefined"){
            return;
        }
        if(item.selected == true){
            item.selected = false;
            var arr = $scope.selected_item_array;
            for( var i = 0; i < arr.length; i++){
               if ( arr[i].image === item.image) {
                 arr.splice(i, 1);
               }
            }
        }
        else{
            item.selected = true;
            $scope.selected_item_array.push(item);
        }
    }

    $scope.load = function() {
        if($scope.selected_item_array.length == 0){
            $rootScope.popupMessage('','Please select one or more items');
        }
        else{
            CanvasService.loadItems($scope.selected_item_array);
        }
    }

    $scope.add = function() {
        $state.go('tab.wardrobe-add');
    }

    $scope.clear = function() {
        WardrobeService.clear().then(function(){
            $scope.data = {
                item_array: [],
                processing_item_array: []
            }
        });
    }

    $scope.clearProccessing = function() {
        WardrobeService.loadStateStr().then(function(state_str){
            $scope.data = JSON.parse(state_str);
            $scope.data.processing_item_array = [];
            WardrobeService.saveState($scope);
        });
    }

    $scope.show = function() {
        console.log(JSON.stringify($scope.data));
    }

    $scope.edit = function(item) {
        var buttons = [
            { text: 'Reimport Item Images' }
        ];
        if(typeof(item.product) !== "undefined"){
            buttons.push({ text: 'Select Other Item Image' });
        }
        $ionicActionSheet.show({
            titleText: 'Item Control',
            destructiveText: 'Delete',
            destructiveButtonClicked: function() {
                for( var i = 0; i < $scope.data.item_array.length; i++){
                    var current_item = $scope.data.item_array[i];
                    if(item.key == current_item.key){
                        $scope.data.item_array.splice(i, 1);
                        WardrobeService.saveState($scope);
                    }
                }
                return true;
            },
            buttons: buttons,
            cancelText: 'Cancel',
            cancel: function() {
                // code for cancel if necessary.
            },
            buttonClicked: function(index) {
                switch (index){
                    case 0 :
                        $ionicLoading.show();
                        for( var i = 0; i < $scope.data.item_array.length; i++){
                            var current_item = $scope.data.item_array[i];
                            if(item.key == current_item.key){
                                $scope.data.item_array.splice(i, 1);
                                WardrobeService.saveState($scope).then(function(){
                                    WardrobeService.addItemByUrl(item.query.userQuery.url).then(function(){
                                        WardrobeService.loadStateStr().then(function(state_str){
                                            $scope.data = JSON.parse(state_str);
                                            keepRequestProduct();
                                            $ionicLoading.hide();
                                        });
                                    });
                                });
                            }
                        }
                        return true;
                    case 1 :
                        $state.go('tab.wardrobe-swap', {item:item});
                        return true;
                }
            }
        });
    }
})
.controller('WardrobeAddCtrl', function($scope, $rootScope, $state, WardrobeService){
    $scope.addToWardrobe = function(url){
        if(url){
            WardrobeService.addItemByUrl(url).then(function(){
                $rootScope.popupMessage('Fetching Item..','It will be processed in a minute');
                $state.go('tab.wardrobe');
            });
        }
        else{
            $rootScope.popupMessage('','Item URL is required');
        }
    }
})
.controller('WardrobeBrowserCtrl', function($scope){

})
.controller('WardrobeSwapCtrl', function($scope, $stateParams, $state, WardrobeService, AsyncStorageService){
    $scope.item = $stateParams.item;
    $scope.selected_image = null;

    $scope.select = function(image){
        $scope.selected_image = image;
    }

    $scope.swap = function(){
        WardrobeService.loadStateStr().then(function(state_str){
            var state = JSON.parse(state_str);
            for(var i=0;i<state.item_array.length;i++){
                var item = state.item_array[i];
                if(item.key == $scope.item.key){
                    item.image = $scope.selected_image;
                }
            }
            AsyncStorageService.setItem('wardrobe_state', JSON.stringify(state)).then(function(){
                $state.go('tab.wardrobe');
            });
        });
    }

    $scope.noImageToShow = function(){
        return (
            typeof($scope.item.product.images) === "undefined" ||
            $scope.item.product.images.length < 2
        );
    }
})
.controller('OpenWithCtrl', function($scope, $stateParams, WardrobeService){
    var openwith_intent = {};
    if(localStorage.getItem('openwith_intent')){
        openwith_intent = JSON.parse(localStorage.getItem('openwith_intent'));
    }

    // for android browser share or just a text
    if(
        typeof openwith_intent.text !== "undefined" &&
        (
            openwith_intent.text.includes('http://') ||
            openwith_intent.text.includes('https://')
        )
    ){
        $scope.url = openwith_intent.text;
    }
    // for iOS browser share
    else if(
        typeof openwith_intent.items !== "undefined" &&
        openwith_intent.items.length > 0 &&
        openwith_intent.items[0].type == "public.url"
    ){
        $scope.url = openwith_intent.items[0].url;
    }
    else{
        $scope.url = null;
    }

    if($scope.url){
        WardrobeService.addItemByUrl($scope.url);
    }
})
.controller('PostCreateCtrl_deprecated_20191001', function($scope, FetchGoals, $state, $stateParams, $rootScope, $cordovaFile, $ionicLoading, $ionicHistory, $location, CameraPictues, $timeout, UxAnalytics, $http, $ionicScrollDelegate, ImageUpload, SlideHeader) {
    $scope.visibility = 'public';
    $scope.submitted = false;
    $location.replace('tab.camera');
    $scope.data = { "ImageURI" :  "Select Image" };
    $scope.goalList = new Array();
    $scope.shopOptionalGoal = false;
    $scope.cameraPictues = CameraPictues;
    $rootScope.getNotification(0); // pull the notification count immediately.

    var user = $rootScope.getCurrentUser();
    if(user.username == user.email){
        $state.go('register2').then(function(){
            $timeout(function(){
                window.location.reload();
            },100);
        });
    }
    else{
        //Tutorial.triggerIfNotCompleted('tutorial_welcome');
    }

    // problem : Appsee starts with 'Main' screen, even though I hardcode to start 'explore'.
    // cause : Appsee auto-stats 'Main' screen asynchronously.
    // solution : Wait 2 second to start 'explore' screen after Appsee auto starts 'Main' screen.
    setTimeout(function(){
        UxAnalytics.setUserId(user.username);
        UxAnalytics.startScreen('post-create');
    }, 2000);

    $scope.$on('$ionicView.enter', function() {
        UxAnalytics.startScreen('post-create');
        SlideHeader.viewEntered($scope);
    });

    FetchGoals.get().then(function(response){
        goals = response;
        for (index = 0; index < goals.length; ++index) {
            $scope.goalList.push({value: goals[index].id, label: goals[index].name});
        }
        $scope.goalList.push({value: 'other', label: 'Other'});
    });

    $scope.sharePost = function(captions, goal, other) {
        var fileURLs = CameraPictues.get();
        var share_post_scope = this;
        var postIdArray = [];
        var photoIdArray = [];
        var uploadTryCount = 0;
        var uploadSuccessCount = 0;
        var param_caption = '';
        if (typeof captions != 'undefined')
        {
            param_caption = captions;
        }

        $scope.submitted = true;
        $ionicLoading.show({template: 'Uploading Photo...<br/><br/><ion-spinner></ion-spinner>'});

        if(fileURLs.length < 2){
            $ionicLoading.hide();
            $rootScope.popupMessage('', 'Upload 2 or More Outfits!');
            $scope.submitted = false;
            return;
        }

        var post_data = {
            captions: param_caption,
            user_id: user.id,
            goal: goal,
            other: other,
            visibility: $scope.visibility,
        };
        for(var i=0; i<fileURLs.length; i++){
            ImageUpload.send(fileURLs[i], encodeURI($rootScope.baseURL + '/api/photo/create/' + i), success, fail);
        }

        // Transfer succeeded
        function success(r) {
            // problem: r from test call and real call is different format
            // cause: test is getting data from $http and real is getting data from ft.upload
            // solution: parse differently by checking attribute
            var result;
            if (typeof r.response != 'undefined'){
                result = JSON.parse(r.response);
            }
            else{
                result = r;
            }
            uploadTryCount++;
            uploadSuccessCount++;
            if(typeof result.id !== 'undefined'){
                photoIdArray.push(result.id);
            }
            if(uploadTryCount == fileURLs.length && uploadSuccessCount > 0){
                $ionicScrollDelegate.scrollTop();
                $ionicLoading.show({
                    template: 'Upload Success ( ' + uploadSuccessCount + ' / ' + uploadTryCount + ' )',
                    duration:500
                });
                var photoIds = photoIdArray.join(',');
                $http.post($rootScope.baseURL+'/api/post/create/with_photos/'+photoIds, post_data);
                $scope.submitted = false;
                $scope.visibility = 'public';
                share_post_scope.goal = undefined;
                share_post_scope.captions = undefined;
                uploadTryCount = 0;
                uploadSuccessCount = 0;
                photoIdArray = [];
                $timeout(function(){
                    CameraPictues.reset();
                    $state.go('tab.account-account', {refresh : new Date().getTime()});
                }, 500);
            }
        }

        // Transfer failed
        function fail(error) {
            uploadTryCount++;
            if(uploadTryCount == fileURLs.length && uploadSuccessCount == 0){
                $ionicLoading.show({template: 'Upload Failed', duration:500});
                $scope.submitted = false;
                uploadTryCount = 0;
                uploadSuccessCount = 0;
            }
        }
    }
    $scope.checkGoal = function(_goal) {
        if (_goal != null && _goal.value == "other")
        {
            $scope.shopOptionalGoal = true;
        }
        else
        {
            $scope.shopOptionalGoal = false;
        }
    }
    $scope.reset = function() {
        CameraPictues.reset();
        this.captions = '';
        this.goal = null;
        $ionicScrollDelegate.scrollTop();
    }
    $scope.hasContent = function(){
        return CameraPictues.get().length > 0 ||
            (typeof(this.captions) !== 'undefined' && this.captions !== '') ||
            (typeof(this.goal) !== 'undefined' && this.goal !== null)
    }
    $scope.setActive = function(visibility){
      $scope.visibility = visibility;
    }
    $scope.isActive = function(visibility){
      return visibility === $scope.visibility;
    }
})
.controller('PostCreateStep1Ctrl_deprecated_20191005', function($scope, $state, $stateParams, $rootScope, $cordovaFile, $ionicLoading, $ionicHistory, $location, CameraPictues, $timeout, UxAnalytics, $http, $ionicScrollDelegate, ImageUpload, SlideHeader, BusinessObjectList, GoalBO) {
    $scope.search_term = '';
    $scope.business_object_list_config = {
        type : 'goal',
        method : 'trending',
    };
    var deterred_function = null;

    BusinessObjectList.reset($scope);
    BusinessObjectList.load($scope);

    $scope.load = function() {
        BusinessObjectList.load($scope);
    };

    $scope.$on('$ionicView.enter', function() {
        UxAnalytics.startScreen('post-create-step-1');
        SlideHeader.viewEntered($scope);
    });

    $scope.goStep2 = function(){
        $ionicHistory.nextViewOptions({
            disableBack: true
        });
        $state.go('tab.post-create-step-2', {refresh : new Date().getTime()});
    }

    $scope.setGoal = function(goal){
        localStorage.setItem('post_create_goal', JSON.stringify(goal));
        $scope.goStep2();
    }

    $scope.storeGoal = function(){
        GoalBO.create(this.search_term).then(function(new_goal){
            $scope.setGoal(new_goal);
        });
    }

    $scope.searchTermSuggestion = function(defer = true){
        var this_scope = this;
        BusinessObjectList.reset($scope);

        $timeout.cancel(deterred_function);
        deterred_function = $timeout(function() {
            $scope.search_term = this_scope.search_term;
            BusinessObjectList.reset($scope);
            BusinessObjectList.load($scope);
        }, $rootScope.config.get('need_to_stay_idle_milisec'));
    }

    $scope.getProspectSearchTerm = function(){
        return $scope.search_term.replace(/\s+/g, "_");
    }

    $scope.setMethod = function(method){
        $scope.business_object_list_config.method = method;
        $scope.searchTermSuggestion();
    }

    $scope.isMethod = function(method){
        return method == $scope.business_object_list_config.method;
    }
})
.controller('PostCreateStep2Ctrl_deprecated_20191005', function($scope, $state, $stateParams, $rootScope, $cordovaFile, $ionicLoading, $ionicHistory, $location, CameraPictues, $timeout, UxAnalytics, $http, $ionicScrollDelegate, ImageUpload, SlideHeader, PostShare, DeepLink, $ionicPopup) {
    $scope.goal = JSON.parse(localStorage.getItem('post_create_goal'));

    $scope.goStep1 = function(call_back_func = null){
        $ionicHistory.nextViewOptions({
            disableBack: true
        });
        $state.go('tab.post-create-step-1', {refresh : new Date().getTime()}).then(function(){
            if(call_back_func){
                call_back_func();
            }
        });
    }

    $scope.resetPreviousStep = function(){
        $scope.goal = null;
        localStorage.removeItem('post_create_goal');
    }

    $scope.resetThisStep = function(){
        CameraPictues.reset();
        localStorage.removeItem('post_create_visibility');
        localStorage.removeItem('post_create_captions');
        this.captions = '';
        $scope.visibility = 'permanent';
    }

    $scope.completePosting = function(share_link){
        localStorage.removeItem('post_create_goal');
        $scope.resetThisStep();
        $scope.goStep1(function(){
            $state.go('tab.account-account', {refresh : new Date().getTime()});
            $ionicPopup.show({
                title: '',
                template: 'Uploaded',
                buttons: [{
                    text: 'Send to Friends & Family',
                    type: 'button-positive',
                    onTap: function (e) {
                        DeepLink.share(share_link);
                    }
                }, {
                    text: '<i class="icon ion-close-circled"></i>',
                    type: 'sl-popup-close-button',
                    onTap: function (e) {

                    }
                }]
            });
        });
    }

    $scope.setCaption = function(){
        localStorage.setItem('post_create_captions', this.captions);
    }

    $scope.getCaption = function(){
        if(localStorage.getItem('post_create_captions')){
            this.captions = localStorage.getItem('post_create_captions');
        }
    }



    $scope.getCaption();
    $scope.visibility = 'permanent';
    if(localStorage.getItem('post_create_visibility')){
        $scope.visibility = localStorage.getItem('post_create_visibility');
    }
    $scope.submitted = false;
    $scope.cameraPictues = CameraPictues;

    var user = $rootScope.getCurrentUser();

    $scope.$on('$ionicView.enter', function() {
        UxAnalytics.startScreen('post-create-step-2');
        SlideHeader.viewEntered($scope);
    });

    $scope.sharePost = function(captions, goal_id, other) {
        var fileURLs = CameraPictues.get();
        var share_post_scope = this;
        var photoIdArray = [];
        var uploadTryCount = 0;
        var uploadSuccessCount = 0;
        var param_caption = '';
        if (typeof captions != 'undefined')
        {
            param_caption = captions;
        }

        $scope.submitted = true;
        $ionicLoading.show({template: 'Uploading Photo...<br/><br/><ion-spinner></ion-spinner>'});

        if(fileURLs.length < 2){
            $ionicLoading.hide();
            $rootScope.popupMessage('', 'Upload 2 or More Outfits!');
            $scope.submitted = false;
            return;
        }

        var post_data = {
            captions: param_caption,
            user_id: user.id,
            goal: goal_id,
            other: other,
            visibility: $scope.visibility,
        };
        for(var i=0; i<fileURLs.length; i++){
            ImageUpload.send(fileURLs[i], encodeURI($rootScope.baseURL + '/api/photo/create/' + i), success, fail);
        }

        // Transfer succeeded
        function success(r) {
            // problem: r from test call and real call is different format
            // cause: test is getting data from $http and real is getting data from ft.upload
            // solution: parse differently by checking attribute
            var result;
            if (typeof r.response != 'undefined'){
                result = JSON.parse(r.response);
            }
            else{
                result = r;
            }
            uploadTryCount++;
            uploadSuccessCount++;
            if(typeof result.id !== 'undefined'){
                photoIdArray.push(result.id);
            }
            if(uploadTryCount == fileURLs.length && uploadSuccessCount > 0){
                var photoIds = photoIdArray.join(',');
                var share_link = '';
                $http.post($rootScope.baseURL+'/api/post/create/with_photos/'+photoIds, post_data).success(function(post){
                    PostShare.getHash(post.id).then(function(hash){
                        if(hash){
                            share_link = $rootScope.baseURL + '/s/' + hash;
                        }
                        else{
                            // some error handling when hash creating failed
                        }
                        $ionicScrollDelegate.scrollTop();
                        $ionicLoading.hide();
                        $scope.completePosting(share_link);
                    });
                })
                .error(function(data, status){
                    $ionicLoading.hide();
                    $rootScope.handleHttpError(data, status);
                });
            }
        }

        // Transfer failed
        function fail(error) {
            uploadTryCount++;
            if(uploadTryCount == fileURLs.length && uploadSuccessCount == 0){
                $ionicLoading.show({template: 'Upload Failed', duration:500});
                $scope.submitted = false;
                uploadTryCount = 0;
                uploadSuccessCount = 0;
            }
        }
    }
    $scope.hasContent = function(){
        return CameraPictues.get().length > 0 ||
            (typeof(this.captions) !== 'undefined' && this.captions !== '')
    }
    $scope.setActive = function(visibility){
        $scope.visibility = visibility;
        localStorage.setItem('post_create_visibility', visibility);
    }
    $scope.isActive = function(visibility){
        return visibility === $scope.visibility;
    }
})
.controller('PostCreateStep1Ctrl', function($scope, $state, $stateParams, $rootScope, $cordovaFile, $ionicLoading, $ionicHistory, $location, DuelService, $timeout, UxAnalytics, $http, $ionicScrollDelegate, ImageUpload, SlideHeader, BusinessObjectList, GoalBO) {

    $scope.title = DuelService.getTitle();
    $scope.titleState = "valid";

    $scope.$on('$ionicView.enter', function() {
        UxAnalytics.startScreen('post-create-step-1');
        SlideHeader.viewEntered($scope);
    });

    $scope.goStep2 = function(){
        $ionicHistory.nextViewOptions({
            disableBack: true
        });
        $state.go('tab.post-create-step-2', {refresh : new Date().getTime()});
    }

    $scope.setTitle = function(title){
        if(title){
            if(title != DuelService.getTitle()){
                $ionicLoading.show();
                $http.post($rootScope.baseURL+'/api/duel/create', {title: title}).success(function(duel){
                    $ionicLoading.hide();
                    DuelService.setDuel(duel);
                    $scope.goStep2();
                })
                .error(function(data, status){
                    $ionicLoading.hide();
                    $rootScope.handleHttpError(data, status);
                });
            }
            else{
                $scope.goStep2();
            }
        }
        else{
            $scope.titleState = "invalid";
        }
    }

    $scope.getTitle = function(){
        return localStorage.getItem('post_create_title');
    }
})
.controller('PostCreateStep2Ctrl', function($scope, $state, $stateParams, $rootScope, $cordovaFile, $ionicLoading, $ionicHistory, $location, DuelService, $timeout, UxAnalytics, $http, $ionicScrollDelegate, ImageUpload, SlideHeader, PostShare, DeepLink, $ionicPopup) {

    $scope.goStep1 = function(call_back_func = null){
        if(DuelService.getChallengeeId() > 0){
            return;
        }
        $ionicHistory.nextViewOptions({
            disableBack: true
        });
        $state.go('tab.post-create-step-1', {refresh : new Date().getTime()}).then(function(){
            if(call_back_func){
                call_back_func();
            }
        });
    }

    $scope.resetPreviousStep = function(){
        localStorage.removeItem('post_create_title');
    }

    $scope.resetThisStep = function(){
        DuelService.reset();
        localStorage.removeItem('post_create_visibility');
        localStorage.removeItem('post_create_captions');
        this.captions = '';
        $scope.visibility = 'permanent';
    }

    $scope.completePosting = function(share_link){
        localStorage.removeItem('post_create_title');
        $scope.resetThisStep();
        $scope.goStep1(function(){
            $state.go('tab.account-account', {refresh : new Date().getTime()});
            $ionicPopup.show({
                title: '',
                template: 'Uploaded',
                buttons: [{
                    text: 'Send to friends to have them pick a winner',
                    type: 'button-positive',
                    onTap: function (e) {
                        DeepLink.share(share_link);
                    }
                }, {
                    text: '<i class="icon ion-close-circled"></i>',
                    type: 'sl-popup-close-button',
                    onTap: function (e) {

                    }
                }]
            });
        });
    }

    $scope.setCaption = function(){
        localStorage.setItem('post_create_captions', this.captions);
    }

    $scope.getCaption = function(){
        if(localStorage.getItem('post_create_captions')){
            this.captions = localStorage.getItem('post_create_captions');
        }
    }

    $scope.duel_allow = true;

    $scope.toggleDuelAllow = function(){
        $scope.duel_allow = !$scope.duel_allow;
        console.log($scope.duel_allow);
    }

    $scope.getCaption();
    $scope.visibility = 'permanent';
    if(localStorage.getItem('post_create_visibility')){
        $scope.visibility = localStorage.getItem('post_create_visibility');
    }
    $scope.submitted = false;
    $scope.duelService = DuelService;

    var user = $rootScope.getCurrentUser();

    $scope.$on('$ionicView.enter', function() {
        UxAnalytics.startScreen('post-create-step-2');
        SlideHeader.viewEntered($scope);
    });

    $scope.sharePost = function(captions) {
        var fileURLs = DuelService.getPictures();
        var share_post_scope = this;
        var photoIdArray = [];
        var uploadTryCount = 0;
        var uploadSuccessCount = 0;
        var param_caption = '';
        if (typeof captions != 'undefined')
        {
            param_caption = captions;
        }

        $scope.submitted = true;
        $ionicLoading.show({template: 'Uploading Photo...<br/><br/><ion-spinner></ion-spinner>'});

        if(!fileURLs[0] || !fileURLs[1]){
            $ionicLoading.hide();
            $rootScope.popupMessage('', 'Other Outfit is Required!');
            $scope.submitted = false;
            return;
        }

        var post_data = {
            captions: param_caption,
            user_id: user.id,
            title : '',
            date_code: '20200102',
            visibility: $scope.visibility,
            duel_id : DuelService.getDuelId()
        };

        for(var i=0; i<fileURLs.length; i++){
            if(fileURLs[i].includes($rootScope.baseURL) && !fileURLs[i].includes('temp')){
                $http.post($rootScope.baseURL+'/api/photo/duplicate/'+DuelService.getChallengeeImgPath()+'/'+DuelService.getChallengeeId()).success(function(r){
                    success(r);
                })
                .error(function(data, status){
                    fail(data);
                });
            }
            else{
                var duel_allow = 1;
                if(!DuelService.getDuelAllow() && i == 0){
                    duel_allow = 0;
                }
                ImageUpload.send(fileURLs[i], encodeURI($rootScope.baseURL + '/api/photo/create/' + i + '/' + duel_allow), success, fail);
            }
        }

        // Transfer succeeded
        function success(r) {
            // problem: r from test call and real call is different format
            // cause: test is getting data from $http and real is getting data from ft.upload
            // solution: parse differently by checking attribute
            var result;
            if (typeof r.response != 'undefined'){
                result = JSON.parse(r.response);
            }
            else{
                result = r;
            }
            uploadTryCount++;
            uploadSuccessCount++;
            if(typeof result.id !== 'undefined'){
                photoIdArray.push(result.id);
                $http({
                    method : 'POST',
                    url : $rootScope.baseURL+"/api/photo/update/"+result.id,
                    data : {
                        state_str: JSON.stringify(DuelService.getPictureState(result.sequence))
                    }
                });
            }
            if(uploadTryCount == fileURLs.length && uploadSuccessCount > 0){
                var photoIds = photoIdArray.join(',');
                var share_link = '';
                $http.post($rootScope.baseURL+'/api/post/create/with_photos/'+photoIds, post_data).success(function(post){
                    PostShare.getHash(post.id).then(function(hash){
                        if(hash){
                            share_link = $rootScope.baseURL + '/s/' + hash;
                        }
                        else{
                            // some error handling when hash creating failed
                        }
                        $ionicScrollDelegate.scrollTop();
                        $ionicLoading.hide();
                        $scope.completePosting(share_link);
                    });
                })
                .error(function(data, status){
                    $ionicLoading.hide();
                    $rootScope.handleHttpError(data, status);
                });
            }
        }

        // Transfer failed
        function fail(error) {
            uploadTryCount++;
            if(uploadTryCount == fileURLs.length && uploadSuccessCount == 0){
                $ionicLoading.show({template: 'Upload Failed', duration:500});
                $scope.submitted = false;
                uploadTryCount = 0;
                uploadSuccessCount = 0;
            }
        }
    }
    $scope.hasContent = function(){
        return DuelService.getPictures().length > 0 ||
            (typeof(this.captions) !== 'undefined' && this.captions !== '')
    }
    $scope.setActive = function(visibility){
        $scope.visibility = visibility;
        localStorage.setItem('post_create_visibility', visibility);
    }
    $scope.isActive = function(visibility){
        return visibility === $scope.visibility;
    }
})
.controller('PostEditCtrl', function($scope, $http, $stateParams, $rootScope, FetchPosts, $ionicHistory, $ionicLoading, UxAnalytics, SlideHeader) {
    $scope.post = $stateParams.post;

    $scope.$on('$ionicView.enter', function() {
        UxAnalytics.startScreen('post-edit');
        SlideHeader.viewEntered($scope);
    });

    $scope.updatePost = function(post){
        $ionicLoading.show();
        $http({
            method: "POST",
            url: $rootScope.baseURL + '/api/post/' + $scope.post.id + '/edit',
            data: {'content': post.content, 'post-id': $scope.post.id }
        })
        .success(function(){
            $ionicLoading.hide();
            $ionicHistory.goBack();
        })
        .error(function(data, status){
            $rootScope.handleHttpError(data, status);
        });
    };
})

.controller('TutorialCtrl_deprecated_20190222',function($scope, Tutorial, Config, BlockerMessage){
    Config.init().then(function(){
        Tutorial.init(Config.get('tutorials'));
        $scope.tutorial = Tutorial;
        BlockerMessage.init();
    });
})

.controller('IntroCtrl',function($scope, $state, $ionicHistory){
    $scope.slideIndex = 0;
    $scope.enterApplication = function(){
        $ionicHistory.nextViewOptions({
            disableBack: true
        });
        localStorage.setItem('have_seen_intro', true);
        $state.go('auth');
    }
    $scope.slideHasChanged = function(index){
        $scope.slideIndex = index;
    }
    $scope.currentSlide = function(index){
        return $scope.slideIndex == index;
    }
})

.controller('RootCtrl',function($rootScope, $state, $ionicHistory){
    // always start as new state
    //window.location.reload(true);
    $ionicHistory.nextViewOptions({
        disableAnimate: true,
        disableBack: true
    });
    if(localStorage.getItem('user') && localStorage.getItem('satellizer_token')){
        $rootScope.renderFirstView();
    }
    else{
        $state.go('auth');
    }
})

.controller('RegisterCtrl', function($scope, $ionicHistory, $state, $rootScope, $http, $auth, $ionicLoading, $q, UxAnalytics) {
    $scope.registerData = {email:'',password:''};

    UxAnalytics.startScreen('register');

    $scope.register = function(registerData){
        $ionicLoading.show();
        $http({
            method : 'POST',
            url : $rootScope.baseURL+'/api/register',
            data : registerData
        })
        .success(function(){
            $ionicLoading.hide();
            $ionicHistory.nextViewOptions({
                disableBack: true
            });
            $state.go('register2',registerData);
        })
        .error(function(data, status){
            $ionicLoading.hide();
            $rootScope.handleHttpError(data, status);
        });
    }
    var fbLoginSuccess = function(response) {
        if (!response.authResponse){
            fbLoginError("Cannot find the authResponse");
            return;
        }
        if(localStorage.getItem('user')){
            console.log('user already logged in');
            return;
        }

        var authResponse = response.authResponse;

        getFacebookProfileInfo(authResponse).then(function(profileInfo) {
            $http({
                method : 'POST',
                url : $rootScope.baseURL+'/api/facebook',
                data : {profile:profileInfo}
            })
            .success(function(data){
                localStorage.setItem('satellizer_token', data.token);
                $http.get($rootScope.baseURL+'/api/authenticate/user').success(function(data){
                    var user = data.user;
                    $rootScope.setCurrentUser(user);
                    $ionicHistory.nextViewOptions({
                        disableBack: true
                    });
                    $rootScope.renderFirstView();
                })
                .error(function(data, status){
                    $rootScope.handleHttpError(data, status);
                });
            })
            .error(function(data, status){
                $rootScope.handleHttpError(data, status);
            });
        }, function(fail){
            // Fail get profile info
            console.log('profile info fail', fail);
        });
    };

    // This is the fail callback from the login method
    var fbLoginError = function(error){
        console.log('fbLoginError', error);
    };

    // This method is to get the user profile info from the facebook api
    var getFacebookProfileInfo = function (authResponse) {
        var info = $q.defer();

        facebookConnectPlugin.api('/me?fields=id,email,first_name,last_name,link,picture.type(large),gender&access_token=' + authResponse.accessToken, null,
            function (response) {
                console.log(response);
                info.resolve(response);
            },
            function (response) {
                console.log(response);
                info.reject(response);
            }
        );
        return info.promise;
    };

    //This method is executed when the user press the "Login with facebook" button
    $scope.facebookSignIn = function() {
        facebookConnectPlugin.getLoginStatus(function(success){
            if(success.status === 'connected'){
                // The user is logged in and has authenticated your app, and response.authResponse supplies
                // the user's ID, a valid access token, a signed request, and the time the access token
                // and signed request each expire
                console.log('getLoginStatus@facebookSignIn-if-connected', success.status);

                $ionicLoading.show({
                    template: 'Logging in...'
                });

                getFacebookProfileInfo(success.authResponse).then(function(profileInfo) {
                    $http({
                        method : 'POST',
                        url : $rootScope.baseURL+'/api/facebook',
                        data : {profile:profileInfo}
                    })
                    .success(function(data){
                        localStorage.setItem('satellizer_token', data.token);
                        $http.get($rootScope.baseURL+'/api/authenticate/user').success(function(data){
                            var user = data.user;
                            $rootScope.setCurrentUser(user);
                            $ionicHistory.nextViewOptions({
                                disableBack: true
                            });
                            $ionicLoading.hide();
                            $rootScope.renderFirstView();
                        })
                        .error(function(data, status){
                            $ionicLoading.hide();
                            $rootScope.handleHttpError(data, status);
                        });
                    })
                    .error(function(data, status){
                        $ionicLoading.hide();
                        $rootScope.handleHttpError(data, status);
                    });
                }, function(fail){
                    // Fail get profile info
                    console.log('profile info fail', fail);
                });

            } else {
                // If (success.status === 'not_authorized') the user is logged in to Facebook,
                // but has not authenticated your app
                // Else the person is not logged into Facebook,
                // so we're not sure if they are logged into this app or not.

                console.log('getLoginStatus@facebookSignIn-else-connected', success.status);

                // Ask the permissions you need. You can learn more about
                // FB permissions here: https://developers.facebook.com/docs/facebook-login/permissions/v2.4
                facebookConnectPlugin.login(['email', 'public_profile'], fbLoginSuccess, fbLoginError);
            }
        });
    };
})
.controller('Register2Ctrl', function($scope, $stateParams, $auth, $rootScope, $http, $ionicLoading, $ionicHistory, $state, $timeout, UsernameAvailability, UxAnalytics, BlockerMessage) {
    $scope.registerData = {
        age: '18',
        gender: 'female',
    };
    $scope.usernameClass = '';
    var credentials = {
        email: $stateParams.email,
        password: $stateParams.password
    }

    UxAnalytics.startScreen('register2');

    if(!localStorage.getItem('user')){
        console.log(credentials);
        $auth.login(credentials).then(function() {
        },
        function(response) {
            $rootScope.handleHttpError(response.data, response.status);
        });
        $scope.registerData.username = $stateParams.email.split('@')[0];
    }
    else{
        var user = $rootScope.getCurrentUser();
        $scope.registerData.gender = user.gender;
        $scope.registerData.username = user.email.split('@')[0];
    }

    $timeout(function(){
        UsernameAvailability.check($scope.registerData.username).then(function(response){
            $scope.usernameClass = response;
        });
    }, 1000);
    $scope.usernameTyped = function(keyEvent){
        UsernameAvailability.typed($scope.registerData.username).then(function(response){
            $scope.usernameClass = response;
        });
    }

    $scope.register2 = function(registerData){
        $ionicLoading.show();
        $http({
            method : 'POST',
            url : $rootScope.baseURL+'/api/register2',
            data : registerData
        })
        .success(function(){
            $http.get($rootScope.baseURL+'/api/authenticate/user').success(function(data){
                var user = data.user;
                $rootScope.setCurrentUser(user);
                $ionicLoading.hide();
                $ionicHistory.nextViewOptions({
                    disableBack: true
                });
                BlockerMessage.init();
                $rootScope.renderFirstView();
            })
            .error(function(data, status){
                $rootScope.handleHttpError(data, status);
            });
        })
        .error(function(data, status){
            $ionicLoading.hide();
            $rootScope.handleHttpError(data, status);
            if(UsernameAvailability.isFailed(data)){
                $scope.usernameClass = 'fail';
            }
        });
    }
})
.controller('ForgetPasswordCtrl', function($scope, $ionicHistory, $state, $rootScope, $http, $auth, $ionicLoading, UxAnalytics) {
    $scope.datas = {email:''};

    $scope.$on('$ionicView.enter', function() {
        UxAnalytics.startScreen('forget-password');
    });

    $scope.sendLink = function(datas){
        $ionicLoading.show({template: 'Sending Password Reset email'});
        $http({
            method : 'POST',
            url : $rootScope.baseURL+'/api/passwordReset',
            data : datas
        })
        .success(function(){
            $ionicLoading.hide();
            $rootScope.popupMessage("", "Email has been sent");
            $ionicHistory.goBack();
        })
        .error(function(data, status){
            $ionicLoading.hide();
            $rootScope.handleHttpError(data, status);
        });
    }
})

.controller('AuthCtrl', function($scope, $location, $stateParams, $ionicHistory, $http, $state, $auth, $rootScope, $ionicLoading, $q, UxAnalytics, BlockerMessage) {

    $scope.loginData = {};
    $scope.loginError = false;
    $scope.loginErrorText;

    // problem : Appsee starts with 'Main' screen, even though I hardcode to start 'login'.
    // cause : Appsee auto-stats 'Main' screen asynchronously.
    // solution : Wait 2 second to start 'login' screen after Appsee auto starts 'Main' screen.
    setTimeout(function(){
        UxAnalytics.startScreen('login');
    }, 2000);

    $scope.login = function() {

        $ionicLoading.show();

        var credentials = {
            email: $scope.loginData.email,
            password: $scope.loginData.password
        }

        $auth.login(credentials).then(function() {
            // Return an $http request for the authenticated user
            $http.get($rootScope.baseURL+'/api/authenticate/user').success(function(data){
                var user = data.user;
                $rootScope.setCurrentUser(user);
                BlockerMessage.init();
                $ionicHistory.nextViewOptions({
                    disableBack: true
                });
                $ionicLoading.hide();
                $rootScope.renderFirstView();
            })
            .error(function(data, status){
                $ionicLoading.hide();
                $rootScope.handleHttpError(data, status);
            })
        },
        function(response) {
            $ionicLoading.hide();
            $rootScope.handleHttpError(response.data, response.status);
        });
    };

    var fbLoginSuccess = function(response) {
        if (!response.authResponse){
            fbLoginError("Cannot find the authResponse");
            return;
        }
        if(localStorage.getItem('user')){
            console.log('user already logged in');
            return;
        }

        var authResponse = response.authResponse;

        getFacebookProfileInfo(authResponse).then(function(profileInfo) {
            $http({
                method : 'POST',
                url : $rootScope.baseURL+'/api/facebook',
                data : {profile:profileInfo}
            })
            .success(function(data){
                localStorage.setItem('satellizer_token', data.token);
                $http.get($rootScope.baseURL+'/api/authenticate/user').success(function(data){
                    var user = data.user;
                    $rootScope.setCurrentUser(user);
                    $ionicHistory.nextViewOptions({
                        disableBack: true
                    });
                    $rootScope.renderFirstView();
                })
                .error(function(data, status){
                    $rootScope.handleHttpError(data, status);
                });
            })
            .error(function(data, status){
                $rootScope.handleHttpError(data, status);
            });
        }, function(fail){
            // Fail get profile info
            console.log('profile info fail', fail);
        });
    };

    // This is the fail callback from the login method
    var fbLoginError = function(error){
        console.log('fbLoginError', error);
    };

    // This method is to get the user profile info from the facebook api
    var getFacebookProfileInfo = function (authResponse) {
        var info = $q.defer();

        facebookConnectPlugin.api('/me?fields=id,email,first_name,last_name,link,picture.type(large),gender&access_token=' + authResponse.accessToken, null,
            function (response) {
                console.log(response);
                info.resolve(response);
            },
            function (response) {
                console.log(response);
                info.reject(response);
            }
        );
        return info.promise;
    };

    //This method is executed when the user press the "Login with facebook" button
    $scope.facebookSignIn = function() {
        facebookConnectPlugin.getLoginStatus(function(success){
            if(success.status === 'connected'){
                // The user is logged in and has authenticated your app, and response.authResponse supplies
                // the user's ID, a valid access token, a signed request, and the time the access token
                // and signed request each expire
                console.log('getLoginStatus@facebookSignIn-if-connected', success.status);

                $ionicLoading.show({
                    template: 'Logging in...'
                });

                getFacebookProfileInfo(success.authResponse).then(function(profileInfo) {
                    $http({
                        method : 'POST',
                        url : $rootScope.baseURL+'/api/facebook',
                        data : {profile:profileInfo}
                    })
                    .success(function(data){
                        localStorage.setItem('satellizer_token', data.token);
                        $http.get($rootScope.baseURL+'/api/authenticate/user').success(function(data){
                            var user = data.user;
                            $rootScope.setCurrentUser(user);
                            $ionicHistory.nextViewOptions({
                                disableBack: true
                            });
                            $ionicLoading.hide();
                            $rootScope.renderFirstView();
                        })
                        .error(function(data, status){
                            $ionicLoading.hide();
                            $rootScope.handleHttpError(data, status);
                        });
                    })
                    .error(function(data, status){
                        $ionicLoading.hide();
                        $rootScope.handleHttpError(data, status);
                    });
                }, function(fail){
                    // Fail get profile info
                    console.log('profile info fail', fail);
                });

            } else {
                // If (success.status === 'not_authorized') the user is logged in to Facebook,
                // but has not authenticated your app
                // Else the person is not logged into Facebook,
                // so we're not sure if they are logged into this app or not.

                console.log('getLoginStatus@facebookSignIn-else-connected', success.status);

                // Ask the permissions you need. You can learn more about
                // FB permissions here: https://developers.facebook.com/docs/facebook-login/permissions/v2.4
                facebookConnectPlugin.login(['email', 'public_profile'], fbLoginSuccess, fbLoginError);
            }
        });
    };

})

.controller('PostCardListCtrl', function($scope, $rootScope, $state, SlideHeader, PostCard, BusinessObjectList, $ionicScrollDelegate, UxAnalytics, $stateParams, $timeout, SearchFilter) {
    var user = $rootScope.getCurrentUser();
    if(user.username == user.email || user.username == ''){
        $state.go('register2').then(function(){
            $timeout(function(){
                window.location.reload();
            },100);
        });
        return;
    }
    var method = $stateParams.method;
    var showSearchTerm = function(){
        var termSign = "#";
        if ($stateParams.type == "goal")
        {
            termSign = '<i class="fa fa-bolt" aria-hidden="true"></i> ';
        }
        if ($stateParams.type == "duel")
        {
            return 'DUELS';
        }
        if($stateParams.searchTerm){
            return termSign+$stateParams.searchTerm.trim();
        }
    }
    var config_map = {
        'single_post' : {
            'title' : 'OUTFITS',
            'no_result_message' : 'Post disappeared in a snap!' ,
            'view' : 'single_post',
            'preload' : false,
        },
        'deep_link' : {
            'title' : 'OUTFITS',
            'no_result_message' : 'Post disappeared in a snap!' ,
            'view' : 'deep_link',
            'preload' : false,
        },
        'following' : {
            'title' : 'FOLLOWING',
            'no_result_message' : 'Tap the <i class="icon ion-search"></i> and find other Snaplookers to follow' ,
            'view' : 'home',
            'preload' : true,
        },
        'search' : {
            'title' : showSearchTerm(),
            'no_result_message' : 'No posts found' ,
            'view' : 'post_search_result',
            'preload' : true,
        },
        'explore' : {
            'title' : "<img class='logo' src='img/logo_20191030.png'/>",
            'no_result_message' : 'No posts found' ,
            'view' : 'explore',
            'preload' : true,
        },
    }
    $scope.state_params = $stateParams;
    $scope.config = config_map[method];
    $scope.postCard = PostCard;
    $scope.business_object_list_config = {
        type : 'post',
        method : method,
    };
    $scope.searchFilter = SearchFilter;
    SearchFilter.init();

    if($scope.config.preload){
        $scope.business_object_list_config.preload = true;
    }

    BusinessObjectList.reset($scope);
    BusinessObjectList.load($scope).then(function(){
        $scope.is_infinite_loading_unlocked = true;
    });

    $scope.filter = function(key, val){
        SearchFilter.set(key, val);
        $scope.search_filter = SearchFilter.getAllInfo();
        $scope.refresh(false);
    }

    $scope.refresh = function(is_pull_to_refresh = true){
        BusinessObjectList.reset($scope);
        if(is_pull_to_refresh){
            $scope.is_list_loading = false;
        }
        BusinessObjectList.load($scope).then(function(){
            $scope.is_infinite_loading_unlocked = true;
        });
        $scope.$broadcast('scroll.refreshComplete');
    }

    $scope.loadMore = function(){
        if(! $scope.config.infinite_scroll){
            $scope.list = [];
            $ionicScrollDelegate.scrollTo(0, 1, false);
            $scope.is_list_loading = true;
        }

        if($scope.config.preload){
            $timeout(function(){
                BusinessObjectList.render($scope, $scope.preloaded_response);
                BusinessObjectList.preload($scope);
            }, 10);
        }
        else{
            BusinessObjectList.load($scope);
        }
    }

    $scope.hideSlideCounter = function(){
        if(typeof $scope.hide_slide_counter === 'undefined'){
            $scope.hide_slide_counter = 0;
        }
        else{
            $scope.hide_slide_counter++;
        }
    }

    $scope.isOwner = function(post){
        if(post && post.user.id == user.id){
            return true;
        }
        return false;
    }

    $scope.$on('$ionicView.enter', function() {
        UxAnalytics.startScreen($scope.config.view);
        SlideHeader.viewEntered($scope);
    });
})

.controller('ItemsCtrl', function($scope, $stateParams){
    $scope.items = JSON.parse($stateParams.photo.state).items;
})

.controller('PostLikersCtrl', function($scope, $stateParams, $http, $location, FetchUsers, $rootScope, $timeout, UxAnalytics) {
    $scope.likes = [];
    $scope.page = 1;
    $scope.noMoreItemsAvailable = false;
    $scope.noResult = false;
    var user = $rootScope.getCurrentUser();

    $scope.$on('$ionicView.enter', function() {
        UxAnalytics.startScreen('post-likers');
    });

    FetchUsers.liker($stateParams.postId, $scope.page).then(function(response){
        likes = response.data;
        if(!response.next_page_url){
            $scope.noMoreItemsAvailable = true;
        }
        $scope.likes = likes;
        $scope.page++;
        if(likes && likes.length == 0){
            $scope.noResult = true;
        }
    });
    $scope.loadMore = function() {
        FetchUsers.liker($stateParams.postId, $scope.page).then(function(response){
            likes = response.data;
            if(!response.next_page_url){
                $scope.noMoreItemsAvailable = true;
            }
            $scope.likes = $scope.likes.concat(likes);
            $timeout(function() {
              $scope.$broadcast('scroll.infiniteScrollComplete');
            });
            $scope.page++;
        });
    };
    $scope.doRefresh = function() {
        $scope.$broadcast('scroll.infiniteScrollComplete');
        $scope.page = 1;
        FetchUsers.liker($stateParams.postId, $scope.page).then(function(response){
            likes = response.data;
            $scope.noMoreItemsAvailable = false;
            if(!response.next_page_url){
                $scope.noMoreItemsAvailable = true;
            }
            $scope.likes = likes;
            $scope.$broadcast('scroll.refreshComplete');
            $scope.page++;
            $scope.noResult = false;
            if(likes && likes.length == 0){
                $scope.noResult = true;
            }
        });
    };
    $scope.notMe = function(like) {
        return (like.user.id != user.id);
    };
})

.controller('PhotoDetailCtrl', function($scope, $stateParams, UxAnalytics, SlideHeader){
    $scope.photo = $stateParams.photo;

    $scope.imageLoaded = function(object) {
        object.loaded = true;
    }

    $scope.$on('$ionicView.enter', function() {
        UxAnalytics.startScreen('photo-detail');
        SlideHeader.viewEntered($scope);
    });
})

.controller('PostCommentCtrl', function($scope, $rootScope, $stateParams, PostComment, SlideHeader, $ionicActionSheet, $ionicPopup, $http, $ionicLoading, $ionicScrollDelegate, Focus, $timeout, BusinessObjectList, UxAnalytics) {
    $scope.post_id = $stateParams.post.id;
    var user = $rootScope.getCurrentUser();
    var resetCommentFormVariables = function(){
        $scope.new_comment = {content:''};
        $scope.new_comment_parent_id = 0;
        $scope.is_comment_submitting = false;
    }
    $scope.business_object_list_config = {
        type : 'comment',
        method : 'fetch',
        callback : resetCommentFormVariables
    };

    BusinessObjectList.reset($scope);
    BusinessObjectList.load($scope);

    $scope.refresh = function(){
        BusinessObjectList.reset($scope);
        $scope.is_list_loading = false;
        BusinessObjectList.load($scope);
        $scope.$broadcast('scroll.refreshComplete');
    }

    $scope.load = function() {
        BusinessObjectList.load($scope);
    };

    $scope.$on('$ionicView.enter', function() {
        UxAnalytics.startScreen('post-comment');
        SlideHeader.viewEntered($scope);
    });

    $scope.replyClicked = function(username, parent_id){
        $scope.new_comment_parent_id = parent_id;
        $scope.new_comment.content = '@' + username + ' ';
        Focus('new_comment');
    };

    $scope.submitComment = function(){
        if($scope.new_comment.content.trim() == ''){
            return;
        }
        if(! $scope.is_comment_submitting){
            $scope.is_comment_submitting = true;
            PostComment.submit(
                $scope.new_comment.content,
                $scope.post_id,
                $scope.new_comment_parent_id
            ).then(function(response){
                PostComment.insert(
                    response,
                    $scope.list,
                    $scope.new_comment_parent_id
                );
                if($stateParams.post.comment_info){
                    $stateParams.post.comment_info.count++;
                }
                else{
                    $stateParams.post.comment_info = {count:1};
                }
                submitCommentDone($scope.new_comment_parent_id);
            }, function(){
                submitCommentDone();
            });
        }
    };

    var submitCommentDone = function(new_comment_parent_id){
        if(new_comment_parent_id == 0){
            $ionicScrollDelegate.scrollTop();
        }
        $scope.is_result_empty = false;
        $ionicLoading.hide();
        resetCommentFormVariables();
    }

    $scope.moreOption = function(comment, comments, index){
        if(user.id == comment.user.id){
            var hideSheet = $ionicActionSheet.show({
                destructiveText: 'Delete',
                cancelText: 'Cancel',
                cancel: function() {

                },
                destructiveButtonClicked: function() {
                    var confirmPopup = $ionicPopup.confirm({
                        title: 'Delete',
                        template: 'Are you sure you want to delete this comment?'
                    });

                    confirmPopup.then(function(res) {
                        if(res) {
                            comments.splice(index,1);
                            PostComment.delete(comment);
                            if($stateParams.post.comment_info){
                                $stateParams.post.comment_info.count--;
                            }
                            else{
                                $stateParams.post.comment_info = null;
                            }
                            if(comments.length == 0){
                                $scope.is_result_empty = true;
                            }
                            hideSheet();
                        }
                    });
                }
            });
        }
        else{
            var hideSheet = $ionicActionSheet.show({
                destructiveText: 'Report',
                cancelText: 'Cancel',
                cancel: function() {

                },
                destructiveButtonClicked: function() {
                    var confirmPopup = $ionicPopup.confirm({
                        title: 'Report',
                        template: 'Are you sure you want to report this comment?'
                    });

                    confirmPopup.then(function(res) {
                        if(res) {
                            PostComment.report(comment);
                            hideSheet();
                        }
                    });
                }
            });
        }
    };
})

.controller('PostExploreCtrl', function($scope, $rootScope, SlideHeader, PostCard, BusinessObjectList, $ionicScrollDelegate, UxAnalytics, $state, $timeout, SearchFilter) {
    var user = $rootScope.getCurrentUser();
    if(user.username == user.email || user.username == ''){
        $state.go('register2').then(function(){
            $timeout(function(){
                window.location.reload();
            },100);
        });
        return;
    }

    $scope.postCard = PostCard;
    $scope.business_object_list_config = {
        type : 'post',
        method : 'explore',
        preload : true
    };
    $scope.searchFilter = SearchFilter;
    SearchFilter.init();

    BusinessObjectList.reset($scope);
    BusinessObjectList.load($scope);

    $scope.filter = function(key, val){
        SearchFilter.set(key, val);
        $scope.search_filter = SearchFilter.getAllInfo();
        $scope.refresh(false);
    }

    $scope.refresh = function(is_pull_to_refresh = true){
        BusinessObjectList.reset($scope);
        if(is_pull_to_refresh){
            $scope.is_list_loading = false;
        }
        BusinessObjectList.load($scope);
        $scope.$broadcast('scroll.refreshComplete');
    }

    $scope.load = function(){
        SearchFilter.set('visible', false);
        $ionicScrollDelegate.scrollTo(0, 1, false);
        $scope.list = [];
        $scope.is_list_loading = true;

        $timeout(function(){
            BusinessObjectList.render($scope, $scope.preloaded_response);
            BusinessObjectList.preload($scope);
        }, 10);
    }

    $scope.$on('$ionicView.enter', function() {
        UxAnalytics.startScreen('tab-explore');
        SlideHeader.viewEntered($scope);
    });
})

.controller('PostSearchCtrl', function($scope, $stateParams, $state, Focus, $rootScope, $timeout, $http, $ionicScrollDelegate, ScrollingDetector, UxAnalytics, FetchSearchResult, Config, SlideHeader) {
    $scope.search_type_active = "tag";
    $scope.searchHolder = "Search hashtags";
    $scope.searchNoResultText = "No hashtags found";
    $scope.searchResult = [];
    $scope.page = 1;
    $scope.mostRecentPostID = 0;
    $scope.noMoreItemsAvailable = false;
    $scope.isSearchRunning = false;
    $scope.noResult = false;
    $scope.search_term = "";
    $scope.need_to_stay_idle_milisec = $rootScope.config.get('need_to_stay_idle_milisec');

    $scope.$on('$ionicView.enter', function() {
        UxAnalytics.startScreen('post-search');
        SlideHeader.viewEntered($scope);
    });


    $timeout(function(){
        $scope.fetchSearchResult("new", 0, $scope.search_type_active);
    }, 0);

    $timeout(function(){
        Focus("search");
    }, 1000);

    $scope.searchTermTyped = function(_search_term, keyEvent, _need_to_stay_idle_milisec = null){
        var need_to_stay_idle_milisec = _need_to_stay_idle_milisec;
        $scope.search_term = _search_term;

        if (_search_term == undefined)
        {
            $scope.search_term = "_top_posts";
        }
        else
        {
            if (_search_term.length == 1 && _search_term == "#")
            {
                $scope.setType(_search_term, "tag");
                $scope.searchResult = [];
            }
            else if (_search_term.length == 1 && _search_term == "@")
            {
                $scope.setType(_search_term, "people");
                $scope.searchResult = [];
            }
        }

        if (need_to_stay_idle_milisec == null)
        {
            need_to_stay_idle_milisec = $scope.need_to_stay_idle_milisec;
        }

        $scope.page = 1;
        $scope.fetchSearchResult("new", need_to_stay_idle_milisec, $scope.search_type_active);
    }

    $scope.fetchSearchResult = function(type, _need_to_stay_idle_milisec, search_type_active) {
        $scope.noResult = false;
        $scope.isSearchRunning = true;
        if (type == "new" || type == "refresh")
        {
            $scope.searchResult = [];
        }
        FetchSearchResult.typed($scope.mostRecentPostID, $scope.search_term, $scope.search_type_active, $scope.page, _need_to_stay_idle_milisec).then(function(response){
            $scope.isSearchRunning = false;
            if(response.data.length > 0){
                $scope.mostRecentPostID = response.data[response.data.length-1].id;
            }

            if (type == "new" || type == "refresh")
            {
                if (response == "fail" || response === undefined || response.length == 0 || response.data.length == 0)
                {
                    $scope.noResult = true;
                    $scope.noMoreItemsAvailable = true;
                }
                // problem : some times search result sets are duplicated
                // cause : this happens when user click one tab to the other tab fast
                // solution : only show result set when current active type was what requested
                else if($scope.search_type_active == search_type_active)
                {
                    $scope.searchResult = response.data;
                    $scope.noResult = false;
                }
                $scope.noMoreItemsAvailable = false;
            }
            else if (type == "more")
            {
                if (response == "fail" || response === undefined || response.length == 0 || response.data.length == 0)
                {
                    $scope.noMoreItemsAvailable = true;
                }
                // problem : some times search result sets are duplicated
                // cause : this happens when user click one tab to the other tab fast
                // solution : only show result set when current active type was what requested
                else if($scope.search_type_active == search_type_active)
                {
                    $scope.searchResult = $scope.searchResult.concat(response.data);
                }
                $timeout(function() {
                  $scope.$broadcast('scroll.infiniteScrollComplete');
                });
            }

            if (type == "refresh")
            {
                $scope.$broadcast('scroll.refreshComplete');
            }

            if(!response.next_page_url)
            {
                $scope.noMoreItemsAvailable = true;
            }
            $scope.page++;
        });
    };
    $scope.loadMore = function() {
    	if ($scope.searchResult.length > 0)
    	{
	        $scope.fetchSearchResult("more", 0, $scope.search_type_active);
    	}
    };
    $scope.doRefresh = function() {
        $scope.$broadcast('scroll.infiniteScrollComplete');
        $scope.page = 1;
        $scope.fetchSearchResult("refresh", 0, $scope.search_type_active);
    };
    $scope.showNoSearchResultText = function() {
        return $scope.searchNoResultText;
    };
    $scope.showPlaceHolder = function() {
        return $scope.searchHolder;
    };
    $scope.setType = function(_searchTerm, type, isRefresh) {
    	if ($scope.search_type_active == type)
    	{
    		return;
    	}
        $scope.search_type_active = type;
        $scope.page = 1;
        $scope.mostRecentPostID = 0;
        if (type == "people")
        {
            $scope.searchHolder = "Search users";
            $scope.searchNoResultText = "No users found.";
        }
        else if (type == "tag")
        {
            $scope.searchHolder = "Search hashtags";
            $scope.searchNoResultText = "No hashtags found.";
        }
        else if (type == "goal")
        {
            $scope.searchHolder = "Search looks";
            $scope.searchNoResultText = "No looks found.";
        }
        else if (type == "duel")
        {
            $scope.searchHolder = "Search duels";
            $scope.searchNoResultText = "No duels found.";
        }
        else
        {
            $scope.searchHolder = "Search";
            $scope.searchNoResultText = "No results found.";
        }
        $scope.searchTermTyped(_searchTerm, null, 0);
    };
})

.controller('PostSearchResultCtrl', function($scope, SlideHeader, PostCard, BusinessObjectList, $ionicScrollDelegate, UxAnalytics, $stateParams, SearchFilter, $timeout) {
    $scope.search_type = "tag";
    $scope.search_term = $stateParams.searchTerm;
    if (typeof $stateParams.type !== 'undefined' && $stateParams.type == 'goal')
    {
        $scope.search_type = "goal";
    }
    if (typeof $stateParams.type !== 'undefined' && $stateParams.type == 'duel')
    {
        $scope.search_type = "duel";
    }
    $scope.postCard = PostCard;
    $scope.business_object_list_config = {
        type : 'post',
        method : 'search',
        preload : true
    };
    $scope.searchFilter = SearchFilter;
    SearchFilter.init();

    BusinessObjectList.reset($scope);
    BusinessObjectList.load($scope);

    $scope.filter = function(key, val){
        SearchFilter.set(key, val);
        $scope.search_filter = SearchFilter.getAllInfo();
        $scope.refresh(false);
    }

    $scope.refresh = function(is_pull_to_refresh = true){
        BusinessObjectList.reset($scope);
        if(is_pull_to_refresh){
            $scope.is_list_loading = false;
        }
        BusinessObjectList.load($scope);
        $scope.$broadcast('scroll.refreshComplete');
    }

    $scope.load = function(){
        SearchFilter.set('visible', false);
        $ionicScrollDelegate.scrollTo(0, 1, false);
        $scope.list = [];
        $scope.is_list_loading = true;

        $timeout(function(){
            BusinessObjectList.render($scope, $scope.preloaded_response);
            BusinessObjectList.preload($scope);
        }, 10);
    }

    $scope.$on('$ionicView.enter', function() {
        UxAnalytics.startScreen('post-search-result');
        SlideHeader.viewEntered($scope);
    });

    $scope.showSearchTerm = function(){
        var termSign = "#";
        if ($scope.search_type == "goal")
        {
            termSign = '<i class="fa fa-bolt" aria-hidden="true"></i> ';
        }
        if($stateParams.searchTerm){
            return termSign+$stateParams.searchTerm.trim();
        }
    }
})

.controller('TabCtrl', function($scope, $rootScope, $state, $ionicTabsDelegate, $ionicScrollDelegate, $ionicHistory) {
    var history_id_map = {};
    function navigateToHistoryStack(history_id, position){
       // get the right history stack based on the current view
       var history = $ionicHistory.viewHistory().histories[history_id];
       var target_view = null;
       if(position == 'first'){
           target_view = history.stack[0];
       }
       else if(position == 'last'){
           target_view = history.stack[history.cursor];
       }

       $ionicHistory.backView(target_view);
       // navigate to it
       $ionicHistory.goBack();
    }
    $scope.tabClicked = function(clicked_tab_id){
        var current_tab_id = $ionicTabsDelegate.selectedIndex();
        var current_history_id = $ionicHistory.currentHistoryId();
        history_id_map[current_tab_id] = current_history_id;

        if(current_tab_id == clicked_tab_id){
            var history_info = $ionicHistory.viewHistory();
            if(history_info.currentView.index == 0){
                $ionicScrollDelegate.scrollTo(0, 0, true);
                return;
            }
            navigateToHistoryStack(current_history_id, 'first');
            return;
        }

        var clicked_tab_key = $rootScope.routeTab(clicked_tab_id);
        var clicked_history_id = history_id_map[clicked_tab_id];

        if(clicked_history_id){
            // if user click notification tab when badge is on
            if(
                clicked_tab_key == "notification" &&
                noAngularVar_notificationCount > 0
            ){
                // reload notification view and reset badge
                $state.go('tab.notification', {timestamp : Date.now()});
                noAngularVar_notificationCount = 0;
            }else{
                navigateToHistoryStack(clicked_history_id, 'last');
            }
        }
        else{
            switch(clicked_tab_key){
                case 'explore':
                    $state.go('tab.explore-explore');
                    break;
                case 'home':
                    $state.go('tab.home');
                    break;
                case 'camera':
                    $state.go('tab.post-create-step-1', {refresh : new Date().getTime()});
                    break;
                case 'notification':
                    $state.go('tab.notification');
                    break;
                case 'account':
                    $state.go('tab.account-account');
                    break;
                default:
                    console.log('Error in tab key');
            }
        }
    }
    $scope.badge = function(){
        return noAngularVar_notificationCount;
    }
})

.controller('VoteResultCtrl', function($scope, $rootScope, VoteResult, $ionicLoading, $stateParams, UxAnalytics, SlideHeader) {
    $scope.voteResult = VoteResult;
    $scope.gender_active = 'all';
    $scope.age_active = 'all';
    $scope.photo_array;
    $scope.top_photo_id;

    $scope.$on('$ionicView.enter', function() {
        UxAnalytics.startScreen('vote-result');
        SlideHeader.viewEntered($scope);
    });

    $ionicLoading.show();
    VoteResult.fetch($stateParams.postId).then(function(photo_array) {
        $scope.photo_array = photo_array;
        $ionicLoading.hide();
        $scope.markPhoto($scope.gender_active, $scope.age_active);
    });

    $scope.markPhoto = function(gender, age) {
        $scope.top_photo_id = VoteResult.getTopPhotoId(gender, age, $scope.photo_array);
    }

    $scope.doRefresh = function(){
        VoteResult.fetch($stateParams.postId).then(function(photo_array) {
            $scope.photo_array = photo_array;
            $scope.$broadcast('scroll.refreshComplete');
            $scope.markPhoto($scope.gender_active, $scope.age_active);
        });
    }

    $scope.setGender = function(gender) {
        $scope.gender_active = gender;
        $scope.markPhoto($scope.gender_active, $scope.age_active);
    }

    $scope.setAge = function(age) {
        $scope.age_active = age;
        $scope.markPhoto($scope.gender_active , $scope.age_active);
    }
})

.controller('AccountCtrl', function($scope, $stateParams, FetchUsers, FetchPosts, $http, $state, $rootScope, $ionicActionSheet, $cordovaCamera, $cordovaFile, $ionicLoading, $timeout, UxAnalytics, ImageUpload, PostCard, BusinessObjectList, SlideHeader, $ionicScrollDelegate) {
    var user = $rootScope.getCurrentUser();

    var method = 'my_profile';
    $scope.profile_user_slug = user.slug;
    if($stateParams.accountSlug != ''){
        method = 'others_profile';
        $scope.profile_user_slug = $stateParams.accountSlug;
    }

    $scope.state_params = $stateParams;
    $scope.postCard = PostCard;
    $scope.business_object_list_config = {
        type : 'post',
        method : method,
        preload : true
    };
    var fetchAccount = function(){
        FetchUsers.get($scope.profile_user_slug).then(function(account_info){
            $scope.account_info = account_info;
            $scope.accountImage = $rootScope.photoPath( account_info.profile_img_path, 'l' );

            if (user.id == $scope.account_info.id)
            {
                $scope.isMyAccount = true;
                $rootScope.currentUser = $scope.account_info;
            }
        });
    }

    fetchAccount();
    BusinessObjectList.reset($scope);
    BusinessObjectList.load($scope);

    if($stateParams.refresh){
        var repeatUntillScrolled = setInterval(function(){
            $ionicScrollDelegate.scrollTo(0, 0, true);
            if($ionicScrollDelegate.getScrollPosition().top == 0){
                clearInterval(repeatUntillScrolled);
            }
        }, 500);
    }

    $scope.refresh = function(){
        fetchAccount();
        BusinessObjectList.reset($scope);
        $scope.is_list_loading = false;
        BusinessObjectList.load($scope);
        $scope.$broadcast('scroll.refreshComplete');
    }

    $scope.load = function(){
        $ionicScrollDelegate.scrollTo(0, 1, false);
        $scope.list = [];
        $scope.is_list_loading = true;

        $timeout(function(){
            BusinessObjectList.render($scope, $scope.preloaded_response);
            BusinessObjectList.preload($scope);
        }, 10);
    }

    $scope.$on('$ionicView.enter', function() {
        UxAnalytics.startScreen('tab-account');
        SlideHeader.viewEntered($scope);
    });

    $scope.changeProfilePicture = function(){
        if ($scope.notMe())
            return;
        // Show the action sheet
        var navCameraSheet = $ionicActionSheet.show({
            buttons: [
                { text: 'Take a Picture' },
                { text: 'Choose from Gallery' }
            ],
            titleText: 'Change Profile Picture',
            cancelText: 'Cancel',
            cancel: function() {
                // code for cancel if necessary.
            },
            buttonClicked: function(index) {
                switch (index){
                    case 0 :
                        var options = {
                            quality: 50,
                            targetWidth: 2400,
                            targetHeight: 2400,
                            correctOrientation: true,
                            allowEdit: true,
                            destinationType: Camera.DestinationType.FILE_URL,
                            sourceType: Camera.PictureSourceType.CAMERA
                        };
                        $cordovaCamera.getPicture(options).then(
                            function(imageData) {
                                localStorage.setItem('photo', imageData);
                                $ionicLoading.show({template: 'Loading Photo', duration:500});
                                $scope.updateProfilePicture(imageData);
                            },
                            function(err){
                            }
                        )
                        return true;
                    case 1 :
                        var options = {
                            quality: 50,
                            targetWidth: 2400,
                            targetHeight: 2400,
                            correctOrientation: true,
                            allowEdit: true,
                            destinationType: Camera.DestinationType.FILE_URI,
                            sourceType: Camera.PictureSourceType.PHOTOLIBRARY
                        };

                        $cordovaCamera.getPicture(options).then(
                            function(imageURI) {
                                window.resolveLocalFileSystemURL(imageURI, function(fileEntry) {
                                    localStorage.setItem('photo', fileEntry.nativeURL);
                                    $ionicLoading.show({template: 'Loading Photo', duration:500});
                                    $scope.updateProfilePicture(fileEntry.nativeURL);
                                });
                            },
                            function(err){
                            }
                        )
                        //Handle Move Button
                        return true;
                }
            }
        });
    }

    $scope.updateProfilePicture = function(picData) {
        $ionicLoading.show({template: 'Uploading Photo...', duration:500});
        // problem: CORS error when accessing file://
        // cause: native problem of new webView
        // solution: convert file src using webView function
        var fileURL = window.Ionic.WebView.convertFileSrc(picData);
        var params = {'user_id': user.id };

        ImageUpload.send(fileURL, encodeURI($rootScope.baseURL + '/api/user/'+user.slug+'/editProfilePicture'), success, fail, params);

        function success(result) {
            $ionicLoading.show({template: 'Upload Successful', duration:500});
            $scope.accountImage = $rootScope.photoPath( result.profile_img_path, 'l' );
        }

        // Transfer failed
        function fail(error) {
            $ionicLoading.show({template: 'Upload Failed', duration:500});
        }
    }

    $scope.notMe = function(like) {
        return !$scope.isMyAccount;
    };

})

.controller('OptionCtrl', function($scope, $stateParams, $http, $state, $ionicPopup, $ionicHistory, $rootScope, $timeout, RestartApp, UxAnalytics) {
    $scope.user = $rootScope.getCurrentUser();

    $scope.$on('$ionicView.enter', function() {
        UxAnalytics.startScreen('account-option');
    });

    $scope.goAccountEdit = function(id){
        $state.go('tab.edit-account');
    };
    $scope.goFindFriends = function(id){
        $state.go('tab.find-friends');
    };
    $scope.goInviteFriends = function(id){
        var options = {
            //message: 'Browse outfits to inspire your next look!',
            //subject: 'Browse Outfits to Inspire Your Next Look!',
            url: $rootScope.baseURL + '/s/intro'
        }
        var onSuccess = function(result) {
            console.log("invite succeed");
        }
        var onError = function(msg) {
            console.log("invite failed with message: " + msg);
        }

        UxAnalytics.startScreen('invite-friends');
        window.plugins.socialsharing.shareWithOptions(options, onSuccess, onError);
    };
    $scope.goChangePassword = function(id){
        $state.go('tab.change-password');
    };
    $scope.logout = function(id){
        var confirmPopup = $ionicPopup.confirm({
            title: 'Log Out',
            template: 'Are you sure you want to log out?'
        });

        confirmPopup.then(function(res) {
            if(res) {
                localStorage.removeItem('user');
                localStorage.removeItem('post_id_array');
                // if we remove token, regular register after fb account log out does not work
                // however if we leave token, it replace itself according to new login.
                // therefore decided not to remove
                //
                //localStorage.removeItem('satellizer_token');
                RestartApp.go('root');
            }
        });
    };
})
.controller('AccountEditCtrl', function($scope, FetchUsers, $http, $rootScope, $ionicHistory, UsernameAvailability, BlockerMessage, UxAnalytics) {
    var user = $rootScope.getCurrentUser();
    $scope.usernameClass = '';

    $scope.$on('$ionicView.enter', function() {
        UxAnalytics.startScreen('account-edit');
    });

    FetchUsers.get(user.slug).then(function(user){
        $scope.user = user;
        var data = {
            username : $scope.user.username,
            age : $scope.user.age,
            gender : $scope.user.gender
        };
        $scope.user_info = data;
    });

    $scope.usernameTyped = function(keyEvent){
        if($scope.user.username == $scope.user_info.username){
            $scope.usernameClass = 'success';
        }
        else{
            UsernameAvailability.typed($scope.user_info.username).then(function(response){
                $scope.usernameClass = response;
            });
        }
    }

    $scope.updateProfile = function(user){
        $http({
            method: "POST",
            url: $rootScope.baseURL + '/api/user/' + $scope.user.slug + '/edit',
            data: user
        })
        .success(function(updated_user){
            $rootScope.popupMessage('', 'Changes successfully updated');
            for(i = 0; i < $rootScope.userTrackArray.length; i++){
                thisUser = $rootScope.userTrackArray[i];
                if(thisUser.id == $scope.user.id){
                    thisUser.username = user.username;
                }
            }
            var user_str = JSON.stringify(updated_user);
            localStorage.removeItem('user');
            localStorage.setItem('user', user_str);
            BlockerMessage.init();
            $ionicHistory.goBack();
        })
        .error(function(data, status){
            $rootScope.handleHttpError(data, status);
            if(UsernameAvailability.isFailed(data)){
                $scope.usernameClass = 'fail';
            }
        });
    };
})
.controller('ChangePasswordCtrl', function($scope, $stateParams, $http, $state, $location, $rootScope, $ionicHistory, UxAnalytics) {
    var user = $rootScope.getCurrentUser();

    $scope.$on('$ionicView.enter', function() {
        UxAnalytics.startScreen('change-password');
    });

    $scope.changePassword = function(pwd){
        $http({
            method: "POST",
            url: $rootScope.baseURL + '/api/user/' + user.slug + '/password/edit',
            data: pwd
        })
        .success(function(){
            $rootScope.popupMessage('', 'Updates successful');
            $ionicHistory.goBack();
        })
        .error(function(data, status){
            $rootScope.handleHttpError(data, status);
        });
    };
})
.controller('ChangeProfilePictureCtrl', function($scope, $stateParams, $http, $state, $location, $ionicPopup) {

})
.controller('FindFriendsCtrl', function($scope, $stateParams, FetchUsers, $http, $rootScope, $timeout) {
    $scope.users = [];
    $scope.page = 1;
    $scope.noMoreItemsAvailable = false;

    FetchUsers.findFriends($scope.page).then(function(users){
        $scope.users = users;
        $scope.page++;
    });

    $scope.loadMore = function() {
        FetchUsers.findFriends($scope.page).then(function(users){
            $scope.users = $scope.users.concat(users);
            $timeout(function() {
              $scope.$broadcast('scroll.infiniteScrollComplete');
            });
            $scope.page++;
            if ( users.length == 0 ) {
                $scope.noMoreItemsAvailable = true;
            }
        });
    };
    $scope.doRefresh = function() {
        $scope.$broadcast('scroll.infiniteScrollComplete');
        $scope.page = 1;
        FetchUsers.findFriends($scope.page).then(function(users){
            $scope.users = users;
            $scope.$broadcast('scroll.refreshComplete');
            $scope.page++;
            $scope.noMoreItemsAvailable = false;
        });
    };
})
.controller('InviteFriendsCtrl', function($scope, $http, $rootScope, $ionicPopup, Focus) {
    $scope.sendInvitation = function(email){
        $http({
            method: "POST",
            url: $rootScope.baseURL + '/api/invite-friends',
            data: {'email' : email }
        })
        .success(function(){
            $rootScope.popupMessage('', 'Invitation has been sent');
            $( ".email" ).val("");
        })
        .error(function(data, status){
            $rootScope.handleHttpError(data, status);
        });
    };

    $scope.focusEmailInput = function(){
        Focus('email');
    }

})
.controller('FollowingCtrl', function($scope, $stateParams, FetchUsers, $http, $rootScope, $timeout, UxAnalytics) {
    var user = $rootScope.getCurrentUser();
    $scope.me = user;
    $scope.users = [];
    $scope.page = 1;
    $scope.noMoreItemsAvailable = false;
    $scope.noResult = false;

    $scope.$on('$ionicView.enter', function() {
        UxAnalytics.startScreen('account-following');
    });

    FetchUsers.following($stateParams.userSlug, $scope.page).then(function(response){
        users = response.data;
        if(!response.next_page_url){
            $scope.noMoreItemsAvailable = true;
        }
        $scope.users = users;
        $scope.page++;
        if(users && users.length == 0){
            $scope.noResult = true;
        }
    });

    $scope.loadMore = function() {
        FetchUsers.following($stateParams.userSlug, $scope.page).then(function(response){
            users = response.data;
            if(!response.next_page_url){
                $scope.noMoreItemsAvailable = true;
            }
            $scope.users = $scope.users.concat(users);
            $timeout(function() {
              $scope.$broadcast('scroll.infiniteScrollComplete');
            });
            $scope.page++;
        });
    };
    $scope.doRefresh = function() {
        $scope.$broadcast('scroll.infiniteScrollComplete');
        $scope.page = 1;
        FetchUsers.following($stateParams.userSlug, $scope.page).then(function(response){
            users = response.data;
            $scope.noMoreItemsAvailable = false;
            if(!response.next_page_url){
                $scope.noMoreItemsAvailable = true;
            }
            $scope.users = users;
            $scope.$broadcast('scroll.refreshComplete');
            $scope.page++;
            $scope.noResult = false;
            if(users && users.length == 0){
                $scope.noResult = true;
            }
        });
    };
})
.controller('FollowerCtrl', function($scope, $stateParams, FetchUsers, $http, $rootScope, $timeout, UxAnalytics) {
    var user = $rootScope.getCurrentUser();
    $scope.me = user;
    $scope.users = [];
    $scope.page = 1;
    $scope.noMoreItemsAvailable = false;
    $scope.noResult = false;
    $scope.userItself = false;

    $scope.$on('$ionicView.enter', function() {
        UxAnalytics.startScreen('account-follower');
    });

    FetchUsers.follower($stateParams.userSlug, $scope.page).then(function(response){
        users = response.data;
        if(!response.next_page_url){
            $scope.noMoreItemsAvailable = true;
        }
        $scope.users = users;
        $scope.page++;
        if(users && users.length == 0){
            $scope.noResult = true;
        }
    });

    $scope.loadMore = function() {
        FetchUsers.follower($stateParams.userSlug, $scope.page).then(function(response){
            users = response.data;
            if(!response.next_page_url){
                $scope.noMoreItemsAvailable = true;
            }
            $scope.users = $scope.users.concat(users);
            $timeout(function() {
              $scope.$broadcast('scroll.infiniteScrollComplete');
            });
            $scope.page++;
        });
    };
    $scope.doRefresh = function() {
        $scope.$broadcast('scroll.infiniteScrollComplete');
        $scope.page = 1;
        FetchUsers.follower($stateParams.userSlug, $scope.page).then(function(response){
            users = response.data;
            $scope.noMoreItemsAvailable = false;
            if(!response.next_page_url){
                $scope.noMoreItemsAvailable = true;
            }
            $scope.users = users;
            $scope.$broadcast('scroll.refreshComplete');
            $scope.page++;
            $scope.noResult = false;
            if(users && users.length == 0){
                $scope.noResult = true;
            }
        });
    };
})
.controller('LikedCtrl', function($scope, $stateParams, FetchPosts, $timeout, UxAnalytics) {
    $scope.posts = [];
    $scope.page = 1;
    $scope.noMoreItemsAvailable = false;

    $scope.$on('$ionicView.enter', function() {
        UxAnalytics.startScreen('account-liked');
    });

    FetchPosts.liked($stateParams.userSlug, $scope.page).then(function(posts){
        $scope.posts = posts;
        $scope.page++;
        if ( posts.length == 0 ) {
            $scope.noMoreItemsAvailable = true;
        }
    });

    $scope.loadMore = function() {
        FetchPosts.liked($stateParams.userSlug, $scope.page).then(function(posts){
            $scope.posts = $scope.posts.concat(posts);
            $timeout(function() {
              $scope.$broadcast('scroll.infiniteScrollComplete');
            });
            $scope.page++;
            if ( posts.length == 0 ) {
                $scope.noMoreItemsAvailable = true;
            }
        });
    };
    $scope.doRefresh = function() {
        $scope.$broadcast('scroll.infiniteScrollComplete');
        $scope.page = 1;
        FetchPosts.liked($stateParams.userSlug, $scope.page).then(function(posts){
            $scope.posts = posts;
            $scope.$broadcast('scroll.refreshComplete');
            $scope.page++;
            $scope.noMoreItemsAvailable = false;
            if ( posts.length == 0 ) {
                $scope.noMoreItemsAvailable = true;
            }
        });
    };
})
.controller('NotificationCtrl', function($scope, FetchNotifications, $rootScope, $state, $timeout, UxAnalytics, SlideHeader) {
    var user = $rootScope.getCurrentUser();
    $scope.notifications = [];
    $scope.page = 1;
    $scope.noMoreItemsAvailable = false;
    $scope.noResult = false;
    $rootScope.getNotification(0); // pull the notification count immediately.

    $scope.$on('$ionicView.enter', function() {
        UxAnalytics.startScreen('tab-notification');
        SlideHeader.viewEntered($scope);
    });

    FetchNotifications.new(user.slug, $scope.page).then(function(response){
        notifications = response.data;
        if(!response.next_page_url){
            $scope.noMoreItemsAvailable = true;
        }
        $scope.notifications = notifications;
        $scope.page++;
        if(notifications && notifications.length == 0){
            $scope.noResult = true;
        }
    });
    $scope.goNotificationDetail = function(src) {
        var data = src.split("/");
        if (data[1] == "post")
        {
            $state.go('tab.single-post-notification',{post_id: data[2]});
        }
        else if (data[1] == "account")
        {
            $state.go('tab.account-notification',{accountSlug: data[2]});
        }
    };
    $scope.loadMore = function() {
        FetchNotifications.new(user.slug, $scope.page).then(function(response){
            notifications = response.data;
            if(!response.next_page_url){
                $scope.noMoreItemsAvailable = true;
            }
            $scope.notifications = $scope.notifications.concat(notifications);
            $timeout(function() {
              $scope.$broadcast('scroll.infiniteScrollComplete');
            });
            $scope.page++;
        });
    };
    $scope.doRefresh = function() {
        $scope.$broadcast('scroll.infiniteScrollComplete');
        $scope.page = 1;
        FetchNotifications.new(user.slug, $scope.page).then(function(response){
            notifications = response.data;
            $scope.noMoreItemsAvailable = false;
            if(!response.next_page_url){
                $scope.noMoreItemsAvailable = true;
            }
            $scope.notifications = notifications;
            $scope.$broadcast('scroll.refreshComplete');
            $scope.page++;
            $scope.noResult = false;
            if(notifications && notifications.length == 0){
                $scope.noResult = true;
            }
        });
    };
})
.controller('LoyaltyPointsCtrl_deprecated_20190224', function($scope, $rootScope, $state, $timeout, $ionicPopup, UxAnalytics, LoyaltyPoints) {

    $scope.doRefresh = function() {
        $scope.noResult = false;
        LoyaltyPoints.summary().then(function(response){
            $scope.points_history = response.points_history;
            if(response.point_count){
                $scope.point_count = response.point_count;
            }
            else{
                $scope.point_count = 0;
            }
            if(response.ticket_count){
                $scope.ticket_count = response.ticket_count;
            }
            else{
                $scope.ticket_count = 0;
            }
            if(response && response.points_history.length == 0){
                $scope.noResult = true;
            }
            $scope.$broadcast('scroll.refreshComplete');
        });
    };

    $scope.convert = function() {
        var confirmPopup = $ionicPopup.confirm({
            title: 'Raffle',
            template: 'All points will become raffle tickets for next raffle'
        });

        confirmPopup.then(function(res) {
            if(res) {
                LoyaltyPoints.convert().then(function(){
                    $scope.doRefresh();
                });
            }
        });
    }

    $scope.explainPoint = function(keyword) {
        var alertPopup = $ionicPopup.alert({
            title: 'Point',
            template: 'this is point'
        });
    }

    $scope.explainTicket = function(keyword) {
        var alertPopup = $ionicPopup.alert({
            title: 'Ticket',
            template: 'this is ticket'
        });
    }

    $scope.doRefresh();
});
