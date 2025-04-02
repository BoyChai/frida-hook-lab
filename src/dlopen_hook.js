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
function hook_pthread_create() {
  Interceptor.attach(Module.findExportByName(null, "pthread_create"), {
    onEnter: function (args) {
      var module = Process.findModuleByAddress(ptr(this.returnAddress));
      //this.returnAddress返回当前函数的地址，也就是谁调用的这个函数

      if (module != null) {
        console.log("[pthread_create] called from", module.name);
      } else {
        console.log("[pthread_create] called from", ptr(this.returnAddress));
      }
    },
  });
}
setImmediate(() => {
  Java.perform(function () {
    hook_dlopen();
  });
});
