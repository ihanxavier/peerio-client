Peerio.UI.controller('loginForm', function($scope) {
	'use strict';
	$scope.login = {}
	$scope.login.version = Peerio.config.version
	$scope.login.showLoading = false
	$scope.login.login = function() {
		Peerio.storage.init($scope.login.username)
		$scope.login.username = $scope.login.username.toLowerCase()
		$scope.$root.$broadcast('login', {
			username: $scope.login.username,
			passOrPIN: $scope.login.passphrase,
			skipPIN: false
		})
	}
	$scope.$on('login', function(event, args) {
		$scope.login.showLoading = true
		$scope.$apply()
		Peerio.user.login(args.username, args.passOrPIN, args.skipPIN, function() {
			if (Peerio.user.authTokens.length) {
				Peerio.network.getSettings(function(data) {
					$scope.login.username = ''
					$scope.login.passphrase = ''
					Peerio.user.firstName = data.firstName
					Peerio.user.lastName  = data.lastName
					Peerio.user.addresses = data.addresses
					Peerio.user.settings = data.settings
					Peerio.user.quota = data.quota
					$scope.$root.$broadcast('mainTopPopulate', null)
					$scope.$root.$broadcast('preferencesOnLogin', null)
					$scope.$root.$broadcast('contactsSectionPopulate', function() {
						$scope.$root.$broadcast('accountSettingsPopulate', null)
						$scope.$root.$broadcast('messagesSectionPopulate', function() {
							$('div.mainTopSectionTab[data-sectionLink=messages]').trigger('mousedown')
						})
						$scope.$root.$broadcast('filesSectionPopulate', null)
						$('div.loginScreen').addClass('slideUp')
						$('div.mainScreen').show()
						Peerio.UI.userMenuPopulate()
					})
				})
			}
			else {
				$scope.login.showLoading = false
				$scope.$apply()
				swal({
					title: document.l10n.getEntitySync('loginFailed').value,
					text: document.l10n.getEntitySync('loginFailedText').value,
					type: 'error',
					confirmButtonText: document.l10n.getEntitySync('OK').value
				}, function() {
					$('div.loginForm form').find('input').first().select()
					$('div.loginForm form').find('input').removeAttr('disabled')
				})
			}
		})
	})
	$scope.login.showSignupForm = function() {
		$scope.login.username   = ''
		$scope.login.passphrase = ''
		$('div.signupSplash').addClass('pullUp')
		setTimeout(function() {
			$('div.signupSplash').remove()
			$('div.signupFields').addClass('visible')
		}, 400)
		setTimeout(function() {
			$('div.signupFields').find('input')[0].focus()
		}, 700)
	}
	$scope.login.showPassphrase = function() {
		if ($('div.loginForm form [data-ng-model="login.passphrase"]').attr('type') === 'text') {
			$('div.loginForm form [data-ng-model="login.passphrase"]').attr('type', 'password')
			$('span.loginShowPassphraseEnable').show()
			$('span.loginShowPassphraseDisable').hide()
		}
		else {
			$('div.loginForm form [data-ng-model="login.passphrase"]').attr('type', 'text')
			$('span.loginShowPassphraseEnable').hide()
			$('span.loginShowPassphraseDisable').show()
		}
	}
})