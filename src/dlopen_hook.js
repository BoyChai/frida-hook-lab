function hook_dlopen() {
  var dlopen = Module.findExportByName(null, "dlopen"); // 6.0
  var android_dlopen_ext = Module.findExportByName(null, "android_dlopen_ext"); // 高版本8.1以上

  Interceptor.attach(dlopen, {
    onEnter: function (args) {
      var path_ptr = args[0];
      var path = ptr(path_ptr).readCString();
      console.log("[dlopen:]", path);
    },
  });

  Interceptor.attach(android_dlopen_ext, {
    onEnter: function (args) {
      var path_ptr = args[0];
      var path = ptr(path_ptr).readCString();
      console.log("[dlopen_ext:]", path);
    },
  });
}
setImmediate(() => {
  Java.perform(function () {
    hook_dlopen();
  });
});
