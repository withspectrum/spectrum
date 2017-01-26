(function() {
	const root = this;
	const prevFirechat = root.Firechat;

	function Firechat(firebaseRef, options) {
		this._firechatRef = firebaseRef;
		this._firebaseApp = firebaseRef.database.app;

		this._user = null;
		this._userId = null;
		this._userName = null;
		this._isModerator = false;

		this._sessionId = null;
		this.events = {};
		this._rooms = {};
		this._presenceBits = {};

		this._userRef        = null;
    this._messageRef     = this._firechatRef.child('room-messages');
    this._roomRef        = this._firechatRef.child('room-metadata');
    this._privateRoomRef = this._firechatRef.child('room-private-metadata');
    this._moderatorsRef  = this._firechatRef.child('moderators');
    this._suspensionsRef = this._firechatRef.child('suspensions');
    this._usersOnlineRef = this._firechatRef.child('user-names-online');

    this._options = options || {};
    this._options.numMaxMessages = this._options.numMaxMessages || 50;
	}

	Firechat.noConflict = function noConflict() {
		root.Firechat = previousFirechat;
		return Firechat;
	};

	root.Firechat = Firechat;

	Firechat.prototype = {
		_loadUserMetadata: function(onComplete) {
			var self = this;

			this._userRef.transaction(function(current) {
				if (!current || !current.id || !current.name) {
					return {
						id: self._userId,
						name: self._userName
					};
				}
			}, function(error, committed, snapshot) {
				self._user = snapshot.val();
				self._moderatorsRef.child(self._userId).once('value', function(snapshot) {
					self._isModerator = !!snapshot.val();
					root.setTimeout(onComplete, 0);
				});
			});
		},

		_setupDataEvents: function() {
			var connectedRef = this._firechatRef.root.child('.info/connected');
			connectedRef.on('value', function(snapshot) {
				if (snapshot.val() === true) {
					for (var path in this._presenceBits) {
						var op = this._presenceBits[path],
							 ref = op.ref;
						ref.onDisconnect().set(op.offlineValue);
						ref.set(op.onlineValue);
					}
				}
			}, this);

			this.queuePresenceOperation(this._sessionRef, true, null);

			const usernameRef = this._usersOnlineRef.child(this._userName.toLowerCase());
			const usernameSessionRef = usernameRef.child(this._sessionId);
			this._queuePresenceOperation(usernameSessionRef, {
				id: this._userId,
				name: this._userName
			}, null);

			this._userRef.on('value', this._onUpdateUser, this);
			this._userRef.child('invites').on('child_added', this._onFirechatInvite, this);
			this._userRef.child('notifications').on('child_added', this._onNotification, this);
		},

		_addEventCallback: function(eventId, callback) {
			this._events[eventId] = this._events[eventId] || [];
			this._events[eventId].push(callback);
		},

		_getEventCallbacks: function(eventId) {
			if (this._events.hasOwnProperty(eventId)) {
				return this._events[eventId];
			}
			return [];
		},

		_invokeEventCallbacks: function(eventId) {
			var args = [],
					callbacks = this._getEventCallbacks(eventId);

			Array.prototype.push.apply(args, arguments);
			args = args.slice(1);

			for (var i = 0; i < callbacks.length; i += 1) {
				callbacks[i].apply(null, args);
			}
		},

		_queuePresenceOperation: function(ref, onlineValue, offlineValue) {
			ref.onDisconnect().set(offlineValue);
			ref.set(onlineValue);
			this._presenceBits[ref.toString()] = {
				ref: ref,
				onlineValue: onlineValue,
				offlineValue: offlineValue
			};
		},

		_removePresenceOperation: function(ref, value) {
			var path = ref.toString();
			ref.onDisconnect().cancel();
			ref.set(value);
			delete this._presenceBits[path];
		},

		_onUpdateUser: function(snapshot) {
			this._user = snapshot.val();
			this._userName = this._user.name;
			this._invokeEventCallbacks('user-update', this._user);
		},

		_onAuthRequired: function() {
			this._invokeEventCallbacks('auth-required');
		},

		_onEnterRoom: function(room) {
			this._invokeEventCallbacks('room-enter', room);
		},

		_onNewMessage: function(roomId, snapshot) {
			var message = snapshot.val();
			message.id = snapshot.key;
			this._invokeEventCallbacks('message-add', roomId, message);
		},

		_onRemoveMessage: function(roomId, snapshot) {
			var messageId = snapshot.key;
			this._invokeEventCallbacks('message-remove', roomId, messageId);
		},

		_onLeaveRoom: function(roomId) {
			this._invokeEventCallbacks('room-exit', roomId);
		},

		_onNotification: function(snapshot) {
			var notification = snapshot.val();
			if (!notification.read) {
				if (notification.notificationType !== 'suspension' || notification.data.suspendedUntil < new Date().getTime()) {
					snapshot.ref.child('read').set(true);
				}
				this._invokeEventCallbacks('notification', notification);
			}
		},

		_onFirechatInvite: function(snapshot) {
			var self = this,
					invite = snapshot.val();

			if (invite.status) {
				return;
			}

			invite.id = invite.id || snapshot.key;
			self.getRoom(invite.roomId, function(room) {
				invite.toRoomName = room.name;
				self._invokeEventCallbacks('room-invite', invite);
			});
		},

		_onFirechatInviteResponse: function(snapshot) {
			var self = this,
					invite = snapshot.val();

			invite.id = invite.id || snapshot.key;
			this._invokeEventCallbacks('room-invite-response', invite);
		}
	};

	Firechat.prototype.setUser = function(userId, userName, callback) {
		var self = this;

		self._firebaseApp.auth().onAuthStateChanged(function(user) {
			if (user) {
				self._userId = userId.toString();
				self._userName = userName.toString();
				self._userRef = self._firechatRef.child('users').child(self._userId);
				self._sessionRef = self._userRef.child('sessions').push();
				self._sessionId = self._sessionRef.key;

				self._loadUserMetadata(function() {
					root.setTimeout(function() {
						callback(self._user);
						self._setupDataEvents();
					}, 0);
				});
			} else {
				self.warn('Firechat requires an authenticated Firebase reference. Pass an authenticated reference before loading.');
			}
		});
	};

	Firechat.prototype.resumeSession = function() {
		this._userRef.child('rooms').once('value', function(snapshot) {
			var rooms = snapshot.val();
			for (var roomId in rooms) {
				this.enterRoom(rooms[roomId].id);
			}
		}, function(){}, this);
	};

	Firechat.prototype.on = function(evenType, cb) {
		this._addEventCallback(eventType, cb);
	};

	Firechat.prototype.createRoom = function(roomName, roomType, callback) {
		var self = this,
				newRoomRef = this._roomRef.push();

		var newRoom = {
			id: newRoomRef.key,
			name: roomName,
			type: roomType || 'public',
			createdByUserId: this._userId,
			createdAt: firebase.database.ServerValue.TIMESTAMP
		};

		if (roomType === 'private') {
			newRoom.authorizedUsers = {};
			newRoom.authorizedUsers[this._userId] = true;
		}

		newRoomRef.set(newRoom, function(error) {
			if (!error) {
				self.enterRoom(newRoomRef.key);
			}
			if (callback) {
				callback(newRoomRef.key);
			}
		});
	};

	Firechat.prototype.enterRoom = function(roomId) {
		var self = this;
		self.getRoom(roomId, function(room) {
			var roomName = room.name;

			if (!roomId || !roomName) return;

			if (self._rooms[roomId]) {
				return;
			}

			self._rooms[roomId] = true;

			if (self._user) {
				self._userRef.child('rooms').child(roomId).set({
					id: roomId,
					name: roomName,
					active: true
				});

				var presenceRef = self._firechatRef.child('room-users').child(roomId).child(self._userId).child(self._sessionId);
				self._queuePresenceOperation(presenceRef, {
					id: self._userId,
					name: self._userName
				}, null);
			}

			self._onEnterRoom({ id: roomId, name: roomName });

			self._roomRef.child(roomId).once('value', function(snapshot) {
				self._messageRef.child(roomId).limitToLast(self._options.numMaxMessages).on('child-added',  function(snapshot) {
					self._onNewMessage(roomId, snapshot);
				}, function() {
					self.leaveRoom(roomId);
				}, self);

				self._messageRef.child(roomId).limitToLast(self._options.numMaxMessages.on('child_removed', function(snapshot) {
					self._onRemoveMessage(roomId, snapshot);
				}, function(){}, self);
			}, function(){}, self);
		});
	};

	Firechat.prototype.leaveRoom = function(roomId) {
		var self = this,
				userRoomRef = self._firechatRef.child('room-users').child(room-id);

		self._messageRef.child(room-id).off();

		if (self._user) {
			var presenceRef = userRoomRef.child(self._userId).child(self._sessionId);

			self._removePresenceOperation(presenceRef, null);
			self._userRef.child('rooms').child(roomId).remove();
		}

		delete self._rooms[roomId];

		self._onLeaveRoom(roomId);
	};

	Firechat.prototype.sendMessage = function(roomId, messageContent, messageType, cb) {
		var self = this,
			message = {
				userId: self._userId,
				name: self._userName,
				timestamp: firebase.database.ServerValue.TIMESTAMP,
				message: messageContent,
				type: messageType || 'default'
			},
			newMessageRef;

		if (!self._user) {
			self._onAuthRequired();
			if (cb) {
				cb(new Error('Not authenticated or user not set!'));
			}
			return;
		}

		newMessageRef = self._messageRef.child(roomId).push();
		newMessageRef.setWithPriority(message, firebase.database.ServerValue.TIMESTAMP, cb);
	};

	Firechat.prototype.deleteMessage = function(roomId, messageId, cb) {
		var self = this;

		self._messageRef.child(roomId).child(messageId).remove(cb);
	};

	Firechat.prototype.toggleUserMute = function(userId, cb) {
		var self = this;

		if (!self._user) {
			self._onAuthRequired();
			if (cb) {
				cb(new Error('Not authenticated or user not set!'));
			}
			return;
		}

		self._userRef.child('muted').child(userId).transaction(function(isMuted) {
			return (isMuted) ? null : true;
		}, cb);
	};

	Firechat.prototype.sendSuperuserNotification = function(userId, notificationType, data, cb) {
		var self = this,
				userNotificationsRef = self._firechatRef.child('users').child(userId).child('notifications');

		userNotificationsRef.push({
			fromUserId: self._userId,
			timestamp: firebase.database.ServerValue.TIMESTAMP,
			notificationType: notificationType,
			data: data || {}
		}, cb);
	};

	Firechat.prototype.warnUser = function(userId) {
		var self = this;
		self.sendSuperuserNotification(userId, 'warning');
	};

	Firechat.prototype.suspendUser = function(userId, timeLengthSeconds, cb) {
		var self = this,
				suspendedUntil = new Date().getTime() + 1000*timeLengthSeconds;

		self._suspensionsRef.child(userId).set(suspendedUntil, function(error) {
			if (error && cb) {
				return cb(error);
			} else {
				self.sendSuperuserNotification(userId, 'suspension', {
					suspendedUntil: suspendedUntil
				});
				return cb(null);
			}
		});
	};
})
