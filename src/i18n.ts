import { createI18n } from 'vue-i18n';

const messages = {
  en: {
    common: {
      emailLabel: 'Email address',
      passwordLabel: 'Password',
      confirmPasswordLabel: 'Confirm Password',
      nameLabel: 'Full Name',
      logout: 'Logout',
      loading: 'Loading...',
      processing: 'Processing...',
      signingIn: 'Signing in...',
      sending: 'Sending...',
    },
    home: {
      title: 'Welcome to Fakaloan!',
      loggedInAs: 'You are logged in as:',
      loadingUser: 'Loading user information...',
      logoutButton: 'Logout',
    },
    login: {
      title: 'Login to Fakaloan',
      forgotPasswordLink: 'Forgot password?',
      submitButton: 'Sign in',
      submitButtonProcessing: 'Signing in...',
      orContinueWith: 'Or continue with',
      googleButton: 'Sign in with Google',
      googleButtonProcessing: 'Signing in...',
      registerPrompt: "Don't have an account?",
      registerLink: 'Create one',
    },
    register: {
      title: 'Create Fakaloan Account',
      passwordHint: 'Minimum 8 characters',
      confirmPasswordPlaceholder: 'Confirm your password',
      submitButton: 'Create Account',
      submitButtonProcessing: 'Creating Account...',
      loginPrompt: 'Already have an account?',
      loginLink: 'Sign in',
    },
    forgotPassword: {
      title: 'Reset Password',
      successMessage:
        'Password reset email sent successfully to the provided address. Please check your inbox and spam folder. You will be redirected shortly.',
      prompt:
        "Enter the email address associated with your account, and we'll send you a link to reset your password.",
      submitButton: 'Send Reset Link',
      submitButtonProcessing: 'Sending...',
      backToLoginLink: 'Back to Login',
    },
    errors: {
      validation: {
        required: '{field} is required',
        email: 'Please enter a valid email address',
        min: 'Password must be at least 8 characters',
        oneOf: 'Passwords must match',
        nameRequired: 'Name is required',
        emailRequired: 'Email is required',
        passwordRequired: 'Password is required',
        confirmPasswordRequired: 'Please confirm your password',
      },
      login: {
        emailPasswordRequired: 'Email and password are required.',
        invalidEmail: 'Invalid email address format.',
        userDisabled: 'This user account has been disabled.',
        invalidCredentials: 'Invalid email or password.',
        unexpectedError: 'An unexpected error occurred during login.',
        googleFail: 'Failed to sign in with Google. Please try again.',
        googleCancelled: 'Google sign-in cancelled.',
        googleAccountExists:
          'An account already exists with this email using a different sign-in method.',
        googleUnexpectedError:
          'An unexpected error occurred during Google sign-in.',
        googleProfileSaveError:
          "Login successful, but couldn't save profile details.",
        loginFailedFallback: 'Login failed',
      },
      register: {
        allFieldsRequired: 'Please fill in all required fields.',
        emailInUse: 'This email address is already registered.',
        invalidEmail: 'Please enter a valid email address.',
        weakPassword:
          'Password is too weak. It must be at least 8 characters long.',
        unexpectedError:
          'An unexpected error occurred during registration. Please try again.',
        registrationFailedFallback: 'Registration failed',
      },
      forgotPassword: {
        userNotFound: 'No account found with this email address.',
        invalidEmail: 'Please enter a valid email address.',
        unexpectedError: 'An unexpected error occurred. Please try again.',
        passwordResetFailedFallback: 'Password reset failed.',
      },
    },
    toast: {
      logoutSuccess: 'You have been logged out.',
      logoutFailed: 'Logout failed. Please try again.',
      loginSuccess: 'Login successful!',
      registrationSuccess: 'Registration successful! Please log in.',
      passwordResetSent:
        'Password reset email sent. Please check your inbox (and spam folder).',
    },
  },
  zu: {
    common: {
      emailLabel: 'Ikheli le-imeyili',
      passwordLabel: 'Iphasiwedi',
      confirmPasswordLabel: 'Qinisekisa Iphasiwedi',
      nameLabel: 'Igama eligcwele',
      logout: 'Phuma',
      loading: 'Iyalayisha...',
      processing: 'Iyacubungula...',
      signingIn: 'Ngena ngemvume...',
      sending: 'Iyathumela...',
    },
    home: {
      title: 'Siyakwamukela ku-Fakaloan!',
      loggedInAs: 'Ungene ngemvume njengo:',
      loadingUser: 'Ilayisha imininingwane yomsebenzisi...',
      logoutButton: 'Phuma',
    },
    login: {
      title: 'Ngena ku-Fakaloan',
      forgotPasswordLink: 'Ukhohlwe iphasiwedi?',
      submitButton: 'Ngena ngemvume',
      submitButtonProcessing: 'Ngena ngemvume...',
      orContinueWith: 'Noma qhubeka no',
      googleButton: 'Ngena nge-Google',
      googleButtonProcessing: 'Ngena ngemvume...',
      registerPrompt: 'Awunayo i-akhawunti?',
      registerLink: 'Dala eyodwa',
    },
    register: {
      title: 'Dala i-Akhawunti ye-Fakaloan',
      passwordHint: 'Okungenani izinhlamvu eziyi-8',
      confirmPasswordPlaceholder: 'Qinisekisa iphasiwedi yakho',
      submitButton: 'Dala i-Akhawunti',
      submitButtonProcessing: 'Idala i-Akhawunti...',
      loginPrompt: 'Usuvele unayo i-akhawunti?',
      loginLink: 'Ngena ngemvume',
    },
    forgotPassword: {
      title: 'Setha kabusha Iphasiwedi',
      successMessage:
        'I-imeyili yokusetha kabusha iphasiwedi ithunyelwe ngempumelelo ekhelini elinikeziwe. Sicela uhlole ibhokisi lakho lokungenayo kanye nefolda yogaxekile. Uzoqondiswa kabusha maduze.',
      prompt:
        'Faka ikheli le-imeyili elihlotshaniswa ne-akhawunti yakho, futhi sizokuthumelela isixhumanisi sokusetha kabusha iphasiwedi yakho.',
      submitButton: 'Thumela Isixhumanisi Sokusetshwa Kabusha',
      submitButtonProcessing: 'Iyathumela...',
      backToLoginLink: 'Buyela Ekungeneni',
    },
    errors: {
      validation: {
        required: '{field} iyadingeka',
        email: 'Sicela ufake ikheli le-imeyili elivumelekile',
        min: 'Iphasiwedi kumele okungenani ibe nezinhlamvu eziyi-8',
        oneOf: 'Amaphasiwedi kumele afane',
        nameRequired: 'Igama liyadingeka',
        emailRequired: 'Ikheli le-imeyili liyadingeka',
        passwordRequired: 'Iphasiwedi iyadingeka',
        confirmPasswordRequired: 'Sicela uqinisekise iphasiwedi yakho',
      },
      login: {
        emailPasswordRequired: 'Ikheli le-imeyili nephasiwedi kuyadingeka.',
        invalidEmail: 'Ifomethi yekheli le-imeyili ayilungile.',
        userDisabled: 'Le akhawunti yomsebenzisi ikhutshaziwe.',
        invalidCredentials: 'Ikheli le-imeyili noma iphasiwedi ayilungile.',
        unexpectedError:
          'Kwenzeke iphutha elingalindelekile ngesikhathi sokungena.',
        googleFail: 'Yehlulekile ukungena nge-Google. Sicela uzame futhi.',
        googleCancelled: 'Ukungena nge-Google kukhanseliwe.',
        googleAccountExists:
          'I-akhawunti isivele ikhona ngaleli kheli le-imeyili kusetshenziswa indlela yokungena ehlukile.',
        googleUnexpectedError:
          'Kwenzeke iphutha elingalindelekile ngesikhathi sokungena nge-Google.',
        googleProfileSaveError:
          'Ukungena ngemvume kuphumelele, kodwa yehlulekile ukugcina imininingwane yephrofayili.',
        loginFailedFallback: 'Ukungena kwehlulekile',
      },
      register: {
        allFieldsRequired: 'Sicela ugcwalise zonke izinkambu ezidingekayo.',
        emailInUse: 'Leli kheli le-imeyili selivele libhalisiwe.',
        invalidEmail: 'Sicela ufake ikheli le-imeyili elivumelekile.',
        weakPassword:
          'Iphasiwedi ibuthakathaka kakhulu. Kumele okungenani ibe nezinhlamvu eziyi-8.',
        unexpectedError:
          'Kwenzeke iphutha elingalindelekile ngesikhathi sokubhalisa. Sicela uzame futhi.',
        registrationFailedFallback: 'Ukubhalisa kwehlulekile',
      },
      forgotPassword: {
        userNotFound: 'Ayikho i-akhawunti etholakele ngaleli kheli le-imeyili.',
        invalidEmail: 'Sicela ufake ikheli le-imeyili elivumelekile.',
        unexpectedError:
          'Kwenzeke iphutha elingalindelekile. Sicela uzame futhi.',
        passwordResetFailedFallback:
          'Ukusetha kabusha iphasiwedi kwehlulekile.',
      },
    },
    toast: {
      logoutSuccess: 'Uphumile.',
      logoutFailed: 'Ukuphuma kwehlulekile. Sicela uzame futhi.',
      loginSuccess: 'Ukungena kuphumelele!',
      registrationSuccess: 'Ukubhalisa kuphumelele! Sicela ungene ngemvume.',
      passwordResetSent:
        'I-imeyili yokusetha kabusha iphasiwedi ithunyelwe. Sicela uhlole ibhokisi lakho lokungenayo (nefolda yogaxekile).',
    },
  },
  xh: {
    common: {
      emailLabel: 'Idilesi ye-imeyile',
      passwordLabel: 'Igama lokugqitha',
      confirmPasswordLabel: 'Qinisekisa igama lokugqitha',
      nameLabel: 'Igama elipheleleyo',
      logout: 'Phuma',
      loading: 'Iyalayisha...',
      processing: 'Iyaqhuba...',
      signingIn: 'Ngena...',
      sending: 'Iyathumela...',
    },
    home: {
      title: 'Wamkelekile kwi-Fakaloan!',
      loggedInAs: 'Ungene njengo:',
      loadingUser: 'Ilayisha inkcazelo yomsebenzisi...',
      logoutButton: 'Phuma',
    },
    login: {
      title: 'Ngena kwi-Fakaloan',
      forgotPasswordLink: 'Ulibele igama lokugqitha?',
      submitButton: 'Ngena',
      submitButtonProcessing: 'Ngena...',
      orContinueWith: 'Okanye qhubeka no',
      googleButton: 'Ngena ngeGoogle',
      googleButtonProcessing: 'Ngena...',
      registerPrompt: 'Awunayo iakhawunti?',
      registerLink: 'Yenza enye',
    },
    register: {
      title: 'Yenza iAkhawunti yeFakaloan',
      passwordHint: 'Ubuncinane oonobumba abasi-8',
      confirmPasswordPlaceholder: 'Qinisekisa igama lakho lokugqitha',
      submitButton: 'Yenza iAkhawunti',
      submitButtonProcessing: 'Yenza iAkhawunti...',
      loginPrompt: 'Sele unayo iakhawunti?',
      loginLink: 'Ngena',
    },
    forgotPassword: {
      title: 'Cwangcisa kwakhona igama lokugqitha',
      successMessage:
        'I-imeyile yokuseta kwakhona igama lokugqitha ithunyelwe ngempumelelo kwidilesi enikiweyo. Nceda ujonge ibhokisi yakho engenayo kunye nefolda yogaxekile. Uza kuthunyelwa kwakhona kungekudala.',
      prompt:
        'Faka idilesi ye-imeyile ehambelana neakhawunti yakho, kwaye siza kukuthumelela ikhonkco lokuseta kwakhona igama lakho lokugqitha.',
      submitButton: 'Thumela ikhonkco lokuseta kwakhona',
      submitButtonProcessing: 'Iyathumela...',
      backToLoginLink: 'Buyela kuNgeno',
    },
    errors: {
      validation: {
        required: '{field} iyafuneka',
        email: 'Nceda ufake idilesi ye-imeyile esebenzayo',
        min: 'Igama lokugqitha kufuneka libe nobuncinane oonobumba abasi-8',
        oneOf: 'Amagama okugqitha kufuneka afane',
        nameRequired: 'Igama liyafuneka',
        emailRequired: 'Idilesi ye-imeyile iyafuneka',
        passwordRequired: 'Igama lokugqitha liyafuneka',
        confirmPasswordRequired: 'Nceda uqinisekise igama lakho lokugqitha',
      },
      login: {
        emailPasswordRequired:
          'Idilesi ye-imeyile kunye negama lokugqitha ziyafuneka.',
        invalidEmail: 'Ifomathi yedilesi ye-imeyile ayilunganga.',
        userDisabled: 'Le akhawunti yomsebenzisi ivaliwe.',
        invalidCredentials:
          'Idilesi ye-imeyile okanye igama lokugqitha alilunganga.',
        unexpectedError:
          'Kukho impazamo engalindelekanga eyenzekileyo ngexesha lokungena.',
        googleFail: 'Ayiphumelelanga ukungena ngeGoogle. Nceda uzame kwakhona.',
        googleCancelled: 'Ukungena ngeGoogle kurhoxisiwe.',
        googleAccountExists:
          'Iakhawunti sele ikhona ngale dilesi ye-imeyile kusetyenziswa indlela eyahlukileyo yokungena.',
        googleUnexpectedError:
          'Kukho impazamo engalindelekanga eyenzekileyo ngexesha lokungena ngeGoogle.',
        googleProfileSaveError:
          'Ukungena kuphumelele, kodwa ayikwazanga ukugcina iinkcukacha zeprofayile.',
        loginFailedFallback: 'Ukungena akuphumelelanga',
      },
      register: {
        allFieldsRequired: 'Nceda ugcwalise onke amacandelo afunekayo.',
        emailInUse: 'Le dilesi ye-imeyile sele ibhalisiwe.',
        invalidEmail: 'Nceda ufake idilesi ye-imeyile esebenzayo.',
        weakPassword:
          'Igama lokugqitha libuthathaka kakhulu. Kufuneka libe nobuncinane oonobumba abasi-8.',
        unexpectedError:
          'Kukho impazamo engalindelekanga eyenzekileyo ngexesha lobhaliso. Nceda uzame kwakhona.',
        registrationFailedFallback: 'Ubhaliso aluphumelelanga',
      },
      forgotPassword: {
        userNotFound: 'Akukho akhawunti ifunyenweyo ngale dilesi ye-imeyile.',
        invalidEmail: 'Nceda ufake idilesi ye-imeyile esebenzayo.',
        unexpectedError:
          'Kukho impazamo engalindelekanga eyenzekileyo. Nceda uzame kwakhona.',
        passwordResetFailedFallback:
          'Ukuseta kwakhona igama lokugqitha akuphumelelanga.',
      },
    },
    toast: {
      logoutSuccess: 'Uphumile.',
      logoutFailed: 'Ukuphuma akuphumelelanga. Nceda uzame kwakhona.',
      loginSuccess: 'Ukungena kuphumelele!',
      registrationSuccess: 'Ubhaliso luphumelele! Nceda ungene.',
      passwordResetSent:
        'I-imeyile yokuseta kwakhona igama lokugqitha ithunyelwe. Nceda ujonge ibhokisi yakho engenayo (kunye nefolda yogaxekile).',
    },
  },
  // Removed af, st, tn
};

const i18n = createI18n({
  legacy: false, // Use Composition API mode
  locale: 'en', // Default locale
  fallbackLocale: 'en', // Fallback locale if translation is missing
  messages, // Your translation messages
});

export default i18n;
