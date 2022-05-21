<template>
  <div class="w-full lg:w-1/3 mx-auto flex items-center justify-center bg-white dark:bg-opacity-5 drop-shadow-md py-12 px-4 my-16 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div>
        <h2 class="text-center text-2xl font-bold text-gray-900 dark:text-white">Sign in to your account</h2>
      </div>

      <form class="mt-8 space-y-6">
        <div>
          <div class="mb-2">
            <label for="email-address" class="sr-only">Email address</label>
            <input
              id="email-address"
              name="email"
              type="email"
              placeholder="Email address"
            />
          </div>

          <div>
            <label for="password" class="sr-only">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="Password"
            />
          </div>
        </div>

        <!-- <div class="flex items-center justify-end">
          <div class="text-sm">
            <a href="#" class="font-medium text-indigo-600 hover:text-indigo-500"> Forgot your password? </a>
          </div>
        </div> -->

        <div>
          <Button fluid>
            Sign in
          </Button>
        </div>
      </form>
    </div>
  </div>
</template>
