

namespace TpDotNetCore.Controllers
{
    public partial class AuthResponse : System.ComponentModel.INotifyPropertyChanged
    {
        private OpResult _status;
        private int? _validFor;
        private string _id;
        private string _token;
        private string _refreshtoken;

        [Newtonsoft.Json.JsonProperty("status", Required = Newtonsoft.Json.Required.Default, NullValueHandling = Newtonsoft.Json.NullValueHandling.Ignore)]
        public OpResult Status
        {
            get { return _status; }
            set
            {
                if (_status != value)
                {
                    _status = value;
                    RaisePropertyChanged();
                }
            }
        }

        /// <summary>The token will be valid for validFor seconds</summary>
        [Newtonsoft.Json.JsonProperty("validFor", Required = Newtonsoft.Json.Required.Default, NullValueHandling = Newtonsoft.Json.NullValueHandling.Ignore)]
        public int? ValidFor
        {
            get { return _validFor; }
            set
            {
                if (_validFor != value)
                {
                    _validFor = value;
                    RaisePropertyChanged();
                }
            }
        }

        /// <summary>The user id</summary>
        [Newtonsoft.Json.JsonProperty("id", Required = Newtonsoft.Json.Required.Default, NullValueHandling = Newtonsoft.Json.NullValueHandling.Ignore)]
        public string Id
        {
            get { return _id; }
            set
            {
                if (_id != value)
                {
                    _id = value;
                    RaisePropertyChanged();
                }
            }
        }

        /// <summary>Ein Authentifizierungstoken mit dem alle folgenden Aufrufe authentifiziert werden.</summary>
        [Newtonsoft.Json.JsonProperty("token", Required = Newtonsoft.Json.Required.Default, NullValueHandling = Newtonsoft.Json.NullValueHandling.Ignore)]
        public string Token
        {
            get { return _token; }
            set
            {
                if (_token != value)
                {
                    _token = value;
                    RaisePropertyChanged();
                }
            }
        }

        /// <summary>Ein RefreshToken mit dem der token erneuert werden kann.</summary>
        [Newtonsoft.Json.JsonProperty("refreshtoken", Required = Newtonsoft.Json.Required.Default, NullValueHandling = Newtonsoft.Json.NullValueHandling.Ignore)]
        public string Refreshtoken
        {
            get { return _refreshtoken; }
            set
            {
                if (_refreshtoken != value)
                {
                    _refreshtoken = value;
                    RaisePropertyChanged();
                }
            }
        }

        public string ToJson()
        {
            return Newtonsoft.Json.JsonConvert.SerializeObject(this);
        }

        public static AuthResponse FromJson(string data)
        {
            return Newtonsoft.Json.JsonConvert.DeserializeObject<AuthResponse>(data);
        }

        public event System.ComponentModel.PropertyChangedEventHandler PropertyChanged;

        protected virtual void RaisePropertyChanged([System.Runtime.CompilerServices.CallerMemberName] string propertyName = null)
        {
            var handler = PropertyChanged;
            if (handler != null)
                handler(this, new System.ComponentModel.PropertyChangedEventArgs(propertyName));
        }

    }

    public partial class CredentialDto : System.ComponentModel.INotifyPropertyChanged
    {
        private string _client_type;
        private string _username;
        private string _password;

        /// <summary>Der Client-Typ 'web', 'ionic'</summary>
        [Newtonsoft.Json.JsonProperty("client_type", Required = Newtonsoft.Json.Required.Default, NullValueHandling = Newtonsoft.Json.NullValueHandling.Ignore)]
        public string Client_type
        {
            get { return _client_type; }
            set
            {
                if (_client_type != value)
                {
                    _client_type = value;
                    RaisePropertyChanged();
                }
            }
        }

        /// <summary>Die E-Mail Adresse 1 .. 160 Zeichen. Wird benötigt für die Bestätigung der Kontoerstellung.</summary>
        [Newtonsoft.Json.JsonProperty("username", Required = Newtonsoft.Json.Required.Default, NullValueHandling = Newtonsoft.Json.NullValueHandling.Ignore)]
        public string Username
        {
            get { return _username; }
            set
            {
                if (_username != value)
                {
                    _username = value;
                    RaisePropertyChanged();
                }
            }
        }

        /// <summary>Das Passwort 1 .. 80 Zeichen. Wird für die Anmeldung benötigt.</summary>
        [Newtonsoft.Json.JsonProperty("password", Required = Newtonsoft.Json.Required.Default, NullValueHandling = Newtonsoft.Json.NullValueHandling.Ignore)]
        public string Password
        {
            get { return _password; }
            set
            {
                if (_password != value)
                {
                    _password = value;
                    RaisePropertyChanged();
                }
            }
        }

        public string ToJson()
        {
            return Newtonsoft.Json.JsonConvert.SerializeObject(this);
        }

        public static CredentialDto FromJson(string data)
        {
            return Newtonsoft.Json.JsonConvert.DeserializeObject<CredentialDto>(data);
        }

        public event System.ComponentModel.PropertyChangedEventHandler PropertyChanged;

        protected virtual void RaisePropertyChanged([System.Runtime.CompilerServices.CallerMemberName] string propertyName = null)
        {
            var handler = PropertyChanged;
            if (handler != null)
                handler(this, new System.ComponentModel.PropertyChangedEventArgs(propertyName));
        }

    }

    public partial class RefreshTokenDto : System.ComponentModel.INotifyPropertyChanged
    {
        private string _refresh_token;

        /// <summary>Der Refresh Token</summary>
        [Newtonsoft.Json.JsonProperty("refresh_token", Required = Newtonsoft.Json.Required.Default, NullValueHandling = Newtonsoft.Json.NullValueHandling.Ignore)]
        public string Refresh_token
        {
            get { return _refresh_token; }
            set
            {
                if (_refresh_token != value)
                {
                    _refresh_token = value;
                    RaisePropertyChanged();
                }
            }
        }

        public string ToJson()
        {
            return Newtonsoft.Json.JsonConvert.SerializeObject(this);
        }

        public static RefreshTokenDto FromJson(string data)
        {
            return Newtonsoft.Json.JsonConvert.DeserializeObject<RefreshTokenDto>(data);
        }

        public event System.ComponentModel.PropertyChangedEventHandler PropertyChanged;

        protected virtual void RaisePropertyChanged([System.Runtime.CompilerServices.CallerMemberName] string propertyName = null)
        {
            var handler = PropertyChanged;
            if (handler != null)
                handler(this, new System.ComponentModel.PropertyChangedEventArgs(propertyName));
        }

    }

    public partial class RegisterDto : System.ComponentModel.INotifyPropertyChanged
    {
        private string _firstname;
        private string _name;
        private string _email;
        private string _username;
        private string _password;

        /// <summary>Der Vorname, 1 .. 80 Zeichen</summary>
        [Newtonsoft.Json.JsonProperty("firstname", Required = Newtonsoft.Json.Required.Default, NullValueHandling = Newtonsoft.Json.NullValueHandling.Ignore)]
        public string Firstname
        {
            get { return _firstname; }
            set
            {
                if (_firstname != value)
                {
                    _firstname = value;
                    RaisePropertyChanged();
                }
            }
        }

        /// <summary>Der Name, 1 .. 80 Zeichen</summary>
        [Newtonsoft.Json.JsonProperty("name", Required = Newtonsoft.Json.Required.Default, NullValueHandling = Newtonsoft.Json.NullValueHandling.Ignore)]
        public string Name
        {
            get { return _name; }
            set
            {
                if (_name != value)
                {
                    _name = value;
                    RaisePropertyChanged();
                }
            }
        }

        /// <summary>Die E-Mail Adresse 1 .. 160 Zeichen. Wird benötigt für die Bestätigung der Kontoerstellung.</summary>
        [Newtonsoft.Json.JsonProperty("email", Required = Newtonsoft.Json.Required.Default, NullValueHandling = Newtonsoft.Json.NullValueHandling.Ignore)]
        public string Email
        {
            get { return _email; }
            set
            {
                if (_email != value)
                {
                    _email = value;
                    RaisePropertyChanged();
                }
            }
        }

        /// <summary>Der Benutzername 1 .. 80 Zeichen. Wird für das Anmeldung benötigt.</summary>
        [Newtonsoft.Json.JsonProperty("username", Required = Newtonsoft.Json.Required.Default, NullValueHandling = Newtonsoft.Json.NullValueHandling.Ignore)]
        public string Username
        {
            get { return _username; }
            set
            {
                if (_username != value)
                {
                    _username = value;
                    RaisePropertyChanged();
                }
            }
        }

        /// <summary>Das Passwort 1 .. 80 Zeichen. Wird für die Anmeldung benötigt.</summary>
        [Newtonsoft.Json.JsonProperty("password", Required = Newtonsoft.Json.Required.Default, NullValueHandling = Newtonsoft.Json.NullValueHandling.Ignore)]
        public string Password
        {
            get { return _password; }
            set
            {
                if (_password != value)
                {
                    _password = value;
                    RaisePropertyChanged();
                }
            }
        }

        public string ToJson()
        {
            return Newtonsoft.Json.JsonConvert.SerializeObject(this);
        }

        public static RegisterDto FromJson(string data)
        {
            return Newtonsoft.Json.JsonConvert.DeserializeObject<RegisterDto>(data);
        }

        public event System.ComponentModel.PropertyChangedEventHandler PropertyChanged;

        protected virtual void RaisePropertyChanged([System.Runtime.CompilerServices.CallerMemberName] string propertyName = null)
        {
            var handler = PropertyChanged;
            if (handler != null)
                handler(this, new System.ComponentModel.PropertyChangedEventArgs(propertyName));
        }

    }

    public partial class RegisterResponse : System.ComponentModel.INotifyPropertyChanged
    {
        private OpResult _status;

        [Newtonsoft.Json.JsonProperty("status", Required = Newtonsoft.Json.Required.Default, NullValueHandling = Newtonsoft.Json.NullValueHandling.Ignore)]
        public OpResult Status
        {
            get { return _status; }
            set
            {
                if (_status != value)
                {
                    _status = value;
                    RaisePropertyChanged();
                }
            }
        }

        public string ToJson()
        {
            return Newtonsoft.Json.JsonConvert.SerializeObject(this);
        }

        public static RegisterResponse FromJson(string data)
        {
            return Newtonsoft.Json.JsonConvert.DeserializeObject<RegisterResponse>(data);
        }

        public event System.ComponentModel.PropertyChangedEventHandler PropertyChanged;

        protected virtual void RaisePropertyChanged([System.Runtime.CompilerServices.CallerMemberName] string propertyName = null)
        {
            var handler = PropertyChanged;
            if (handler != null)
                handler(this, new System.ComponentModel.PropertyChangedEventArgs(propertyName));
        }

    }

    public partial class ConfirmResponse : System.ComponentModel.INotifyPropertyChanged
    {
        private OpResult _status;

        [Newtonsoft.Json.JsonProperty("status", Required = Newtonsoft.Json.Required.Default, NullValueHandling = Newtonsoft.Json.NullValueHandling.Ignore)]
        public OpResult Status
        {
            get { return _status; }
            set
            {
                if (_status != value)
                {
                    _status = value;
                    RaisePropertyChanged();
                }
            }
        }

        public string ToJson()
        {
            return Newtonsoft.Json.JsonConvert.SerializeObject(this);
        }

        public static ConfirmResponse FromJson(string data)
        {
            return Newtonsoft.Json.JsonConvert.DeserializeObject<ConfirmResponse>(data);
        }

        public event System.ComponentModel.PropertyChangedEventHandler PropertyChanged;

        protected virtual void RaisePropertyChanged([System.Runtime.CompilerServices.CallerMemberName] string propertyName = null)
        {
            var handler = PropertyChanged;
            if (handler != null)
                handler(this, new System.ComponentModel.PropertyChangedEventArgs(propertyName));
        }

    }

    public partial class RecoverPasswordParams : System.ComponentModel.INotifyPropertyChanged
    {
        private string _email;
        private string _username;

        /// <summary>Die E-Mail Adresse 1 .. 160 Zeichen. Wird benötigt für die Bestätigung der Kontoerstellung.</summary>
        [Newtonsoft.Json.JsonProperty("email", Required = Newtonsoft.Json.Required.Default, NullValueHandling = Newtonsoft.Json.NullValueHandling.Ignore)]
        public string Email
        {
            get { return _email; }
            set
            {
                if (_email != value)
                {
                    _email = value;
                    RaisePropertyChanged();
                }
            }
        }

        /// <summary>Der Benutzername 1 .. 80 Zeichen. Wird für das Anmeldung benötigt.</summary>
        [Newtonsoft.Json.JsonProperty("username", Required = Newtonsoft.Json.Required.Default, NullValueHandling = Newtonsoft.Json.NullValueHandling.Ignore)]
        public string Username
        {
            get { return _username; }
            set
            {
                if (_username != value)
                {
                    _username = value;
                    RaisePropertyChanged();
                }
            }
        }

        public string ToJson()
        {
            return Newtonsoft.Json.JsonConvert.SerializeObject(this);
        }

        public static RecoverPasswordParams FromJson(string data)
        {
            return Newtonsoft.Json.JsonConvert.DeserializeObject<RecoverPasswordParams>(data);
        }

        public event System.ComponentModel.PropertyChangedEventHandler PropertyChanged;

        protected virtual void RaisePropertyChanged([System.Runtime.CompilerServices.CallerMemberName] string propertyName = null)
        {
            var handler = PropertyChanged;
            if (handler != null)
                handler(this, new System.ComponentModel.PropertyChangedEventArgs(propertyName));
        }

    }

    public partial class RecoverUsernameParams : System.ComponentModel.INotifyPropertyChanged
    {
        private string _email;

        /// <summary>Die E-Mail Adresse 1 .. 160 Zeichen. Wird benötigt für die Bestätigung der Kontoerstellung.</summary>
        [Newtonsoft.Json.JsonProperty("email", Required = Newtonsoft.Json.Required.Default, NullValueHandling = Newtonsoft.Json.NullValueHandling.Ignore)]
        public string Email
        {
            get { return _email; }
            set
            {
                if (_email != value)
                {
                    _email = value;
                    RaisePropertyChanged();
                }
            }
        }

        public string ToJson()
        {
            return Newtonsoft.Json.JsonConvert.SerializeObject(this);
        }

        public static RecoverUsernameParams FromJson(string data)
        {
            return Newtonsoft.Json.JsonConvert.DeserializeObject<RecoverUsernameParams>(data);
        }

        public event System.ComponentModel.PropertyChangedEventHandler PropertyChanged;

        protected virtual void RaisePropertyChanged([System.Runtime.CompilerServices.CallerMemberName] string propertyName = null)
        {
            var handler = PropertyChanged;
            if (handler != null)
                handler(this, new System.ComponentModel.PropertyChangedEventArgs(propertyName));
        }

    }

    public partial class RecoverPasswordResponse : System.ComponentModel.INotifyPropertyChanged
    {
        private OpResult _status;

        [Newtonsoft.Json.JsonProperty("status", Required = Newtonsoft.Json.Required.Default, NullValueHandling = Newtonsoft.Json.NullValueHandling.Ignore)]
        public OpResult Status
        {
            get { return _status; }
            set
            {
                if (_status != value)
                {
                    _status = value;
                    RaisePropertyChanged();
                }
            }
        }

        public string ToJson()
        {
            return Newtonsoft.Json.JsonConvert.SerializeObject(this);
        }

        public static RecoverPasswordResponse FromJson(string data)
        {
            return Newtonsoft.Json.JsonConvert.DeserializeObject<RecoverPasswordResponse>(data);
        }

        public event System.ComponentModel.PropertyChangedEventHandler PropertyChanged;

        protected virtual void RaisePropertyChanged([System.Runtime.CompilerServices.CallerMemberName] string propertyName = null)
        {
            var handler = PropertyChanged;
            if (handler != null)
                handler(this, new System.ComponentModel.PropertyChangedEventArgs(propertyName));
        }

    }

    public partial class RecoverUsernameResponse : System.ComponentModel.INotifyPropertyChanged
    {
        private OpResult _status;

        [Newtonsoft.Json.JsonProperty("status", Required = Newtonsoft.Json.Required.Default, NullValueHandling = Newtonsoft.Json.NullValueHandling.Ignore)]
        public OpResult Status
        {
            get { return _status; }
            set
            {
                if (_status != value)
                {
                    _status = value;
                    RaisePropertyChanged();
                }
            }
        }

        public string ToJson()
        {
            return Newtonsoft.Json.JsonConvert.SerializeObject(this);
        }

        public static RecoverUsernameResponse FromJson(string data)
        {
            return Newtonsoft.Json.JsonConvert.DeserializeObject<RecoverUsernameResponse>(data);
        }

        public event System.ComponentModel.PropertyChangedEventHandler PropertyChanged;

        protected virtual void RaisePropertyChanged([System.Runtime.CompilerServices.CallerMemberName] string propertyName = null)
        {
            var handler = PropertyChanged;
            if (handler != null)
                handler(this, new System.ComponentModel.PropertyChangedEventArgs(propertyName));
        }

    }

    public partial class SetPasswordParams : System.ComponentModel.INotifyPropertyChanged
    {
        private string _code;
        private string _username;
        private string _password;

        /// <summary>Der Passwortresetcode.</summary>
        [Newtonsoft.Json.JsonProperty("code", Required = Newtonsoft.Json.Required.Default, NullValueHandling = Newtonsoft.Json.NullValueHandling.Ignore)]
        public string Code
        {
            get { return _code; }
            set
            {
                if (_code != value)
                {
                    _code = value;
                    RaisePropertyChanged();
                }
            }
        }

        /// <summary>Der Benutzername 1 .. 80 Zeichen. Wird für das Anmeldung benötigt.</summary>
        [Newtonsoft.Json.JsonProperty("username", Required = Newtonsoft.Json.Required.Default, NullValueHandling = Newtonsoft.Json.NullValueHandling.Ignore)]
        public string Username
        {
            get { return _username; }
            set
            {
                if (_username != value)
                {
                    _username = value;
                    RaisePropertyChanged();
                }
            }
        }

        /// <summary>Das Passwort 1 .. 80 Zeichen. Wird für die Anmeldung benötigt.</summary>
        [Newtonsoft.Json.JsonProperty("password", Required = Newtonsoft.Json.Required.Default, NullValueHandling = Newtonsoft.Json.NullValueHandling.Ignore)]
        public string Password
        {
            get { return _password; }
            set
            {
                if (_password != value)
                {
                    _password = value;
                    RaisePropertyChanged();
                }
            }
        }

        public string ToJson()
        {
            return Newtonsoft.Json.JsonConvert.SerializeObject(this);
        }

        public static SetPasswordParams FromJson(string data)
        {
            return Newtonsoft.Json.JsonConvert.DeserializeObject<SetPasswordParams>(data);
        }

        public event System.ComponentModel.PropertyChangedEventHandler PropertyChanged;

        protected virtual void RaisePropertyChanged([System.Runtime.CompilerServices.CallerMemberName] string propertyName = null)
        {
            var handler = PropertyChanged;
            if (handler != null)
                handler(this, new System.ComponentModel.PropertyChangedEventArgs(propertyName));
        }

    }

    public partial class SetPasswordResponse : System.ComponentModel.INotifyPropertyChanged
    {
        private OpResult _status;

        [Newtonsoft.Json.JsonProperty("status", Required = Newtonsoft.Json.Required.Default, NullValueHandling = Newtonsoft.Json.NullValueHandling.Ignore)]
        public OpResult Status
        {
            get { return _status; }
            set
            {
                if (_status != value)
                {
                    _status = value;
                    RaisePropertyChanged();
                }
            }
        }

        public string ToJson()
        {
            return Newtonsoft.Json.JsonConvert.SerializeObject(this);
        }

        public static SetPasswordResponse FromJson(string data)
        {
            return Newtonsoft.Json.JsonConvert.DeserializeObject<SetPasswordResponse>(data);
        }

        public event System.ComponentModel.PropertyChangedEventHandler PropertyChanged;

        protected virtual void RaisePropertyChanged([System.Runtime.CompilerServices.CallerMemberName] string propertyName = null)
        {
            var handler = PropertyChanged;
            if (handler != null)
                handler(this, new System.ComponentModel.PropertyChangedEventArgs(propertyName));
        }

    }

    public partial class ProfileResponseDto : System.ComponentModel.INotifyPropertyChanged
    {
        private string _id;
        private string _pictureUrl;
        private UserDto _user;
        private OpResult _status;

        /// <summary>The user profile id</summary>
        [Newtonsoft.Json.JsonProperty("id", Required = Newtonsoft.Json.Required.Default, NullValueHandling = Newtonsoft.Json.NullValueHandling.Ignore)]
        public string Id
        {
            get { return _id; }
            set
            {
                if (_id != value)
                {
                    _id = value;
                    RaisePropertyChanged();
                }
            }
        }

        /// <summary>The profile picture url</summary>
        [Newtonsoft.Json.JsonProperty("pictureUrl", Required = Newtonsoft.Json.Required.Default, NullValueHandling = Newtonsoft.Json.NullValueHandling.Ignore)]
        public string PictureUrl
        {
            get { return _pictureUrl; }
            set
            {
                if (_pictureUrl != value)
                {
                    _pictureUrl = value;
                    RaisePropertyChanged();
                }
            }
        }

        [Newtonsoft.Json.JsonProperty("user", Required = Newtonsoft.Json.Required.Default, NullValueHandling = Newtonsoft.Json.NullValueHandling.Ignore)]
        public UserDto User
        {
            get { return _user; }
            set
            {
                if (_user != value)
                {
                    _user = value;
                    RaisePropertyChanged();
                }
            }
        }

        [Newtonsoft.Json.JsonProperty("status", Required = Newtonsoft.Json.Required.Default, NullValueHandling = Newtonsoft.Json.NullValueHandling.Ignore)]
        public OpResult Status
        {
            get { return _status; }
            set
            {
                if (_status != value)
                {
                    _status = value;
                    RaisePropertyChanged();
                }
            }
        }

        public string ToJson()
        {
            return Newtonsoft.Json.JsonConvert.SerializeObject(this);
        }

        public static ProfileResponseDto FromJson(string data)
        {
            return Newtonsoft.Json.JsonConvert.DeserializeObject<ProfileResponseDto>(data);
        }

        public event System.ComponentModel.PropertyChangedEventHandler PropertyChanged;

        protected virtual void RaisePropertyChanged([System.Runtime.CompilerServices.CallerMemberName] string propertyName = null)
        {
            var handler = PropertyChanged;
            if (handler != null)
                handler(this, new System.ComponentModel.PropertyChangedEventArgs(propertyName));
        }

    }

    public partial class PunchResponse : System.ComponentModel.INotifyPropertyChanged
    {
        private OpResult _status;
        private DayPunchesDto _punches;

        [Newtonsoft.Json.JsonProperty("status", Required = Newtonsoft.Json.Required.Default, NullValueHandling = Newtonsoft.Json.NullValueHandling.Ignore)]
        public OpResult Status
        {
            get { return _status; }
            set
            {
                if (_status != value)
                {
                    _status = value;
                    RaisePropertyChanged();
                }
            }
        }

        [Newtonsoft.Json.JsonProperty("punches", Required = Newtonsoft.Json.Required.Default, NullValueHandling = Newtonsoft.Json.NullValueHandling.Ignore)]
        public DayPunchesDto Punches
        {
            get { return _punches; }
            set
            {
                if (_punches != value)
                {
                    _punches = value;
                    RaisePropertyChanged();
                }
            }
        }

        public string ToJson()
        {
            return Newtonsoft.Json.JsonConvert.SerializeObject(this);
        }

        public static PunchResponse FromJson(string data)
        {
            return Newtonsoft.Json.JsonConvert.DeserializeObject<PunchResponse>(data);
        }

        public event System.ComponentModel.PropertyChangedEventHandler PropertyChanged;

        protected virtual void RaisePropertyChanged([System.Runtime.CompilerServices.CallerMemberName] string propertyName = null)
        {
            var handler = PropertyChanged;
            if (handler != null)
                handler(this, new System.ComponentModel.PropertyChangedEventArgs(propertyName));
        }

    }

    public partial class DayResponse : System.ComponentModel.INotifyPropertyChanged
    {
        private OpResult _status;
        private DayPunchesDto _punches;

        [Newtonsoft.Json.JsonProperty("status", Required = Newtonsoft.Json.Required.Default, NullValueHandling = Newtonsoft.Json.NullValueHandling.Ignore)]
        public OpResult Status
        {
            get { return _status; }
            set
            {
                if (_status != value)
                {
                    _status = value;
                    RaisePropertyChanged();
                }
            }
        }

        [Newtonsoft.Json.JsonProperty("punches", Required = Newtonsoft.Json.Required.Default, NullValueHandling = Newtonsoft.Json.NullValueHandling.Ignore)]
        public DayPunchesDto Punches
        {
            get { return _punches; }
            set
            {
                if (_punches != value)
                {
                    _punches = value;
                    RaisePropertyChanged();
                }
            }
        }

        public string ToJson()
        {
            return Newtonsoft.Json.JsonConvert.SerializeObject(this);
        }

        public static DayResponse FromJson(string data)
        {
            return Newtonsoft.Json.JsonConvert.DeserializeObject<DayResponse>(data);
        }

        public event System.ComponentModel.PropertyChangedEventHandler PropertyChanged;

        protected virtual void RaisePropertyChanged([System.Runtime.CompilerServices.CallerMemberName] string propertyName = null)
        {
            var handler = PropertyChanged;
            if (handler != null)
                handler(this, new System.ComponentModel.PropertyChangedEventArgs(propertyName));
        }

    }

    public partial class WeekResponse : System.ComponentModel.INotifyPropertyChanged
    {
        private OpResult _status;
        private WeekPunchesDto _punches;

        [Newtonsoft.Json.JsonProperty("status", Required = Newtonsoft.Json.Required.Default, NullValueHandling = Newtonsoft.Json.NullValueHandling.Ignore)]
        public OpResult Status
        {
            get { return _status; }
            set
            {
                if (_status != value)
                {
                    _status = value;
                    RaisePropertyChanged();
                }
            }
        }

        [Newtonsoft.Json.JsonProperty("punches", Required = Newtonsoft.Json.Required.Default, NullValueHandling = Newtonsoft.Json.NullValueHandling.Ignore)]
        public WeekPunchesDto Punches
        {
            get { return _punches; }
            set
            {
                if (_punches != value)
                {
                    _punches = value;
                    RaisePropertyChanged();
                }
            }
        }

        public string ToJson()
        {
            return Newtonsoft.Json.JsonConvert.SerializeObject(this);
        }

        public static WeekResponse FromJson(string data)
        {
            return Newtonsoft.Json.JsonConvert.DeserializeObject<WeekResponse>(data);
        }

        public event System.ComponentModel.PropertyChangedEventHandler PropertyChanged;

        protected virtual void RaisePropertyChanged([System.Runtime.CompilerServices.CallerMemberName] string propertyName = null)
        {
            var handler = PropertyChanged;
            if (handler != null)
                handler(this, new System.ComponentModel.PropertyChangedEventArgs(propertyName));
        }

    }

    public partial class MonthResponse : System.ComponentModel.INotifyPropertyChanged
    {
        private OpResult _status;
        private MonthPunchesDto _punches;

        [Newtonsoft.Json.JsonProperty("status", Required = Newtonsoft.Json.Required.Default, NullValueHandling = Newtonsoft.Json.NullValueHandling.Ignore)]
        public OpResult Status
        {
            get { return _status; }
            set
            {
                if (_status != value)
                {
                    _status = value;
                    RaisePropertyChanged();
                }
            }
        }

        [Newtonsoft.Json.JsonProperty("punches", Required = Newtonsoft.Json.Required.Default, NullValueHandling = Newtonsoft.Json.NullValueHandling.Ignore)]
        public MonthPunchesDto Punches
        {
            get { return _punches; }
            set
            {
                if (_punches != value)
                {
                    _punches = value;
                    RaisePropertyChanged();
                }
            }
        }

        public string ToJson()
        {
            return Newtonsoft.Json.JsonConvert.SerializeObject(this);
        }

        public static MonthResponse FromJson(string data)
        {
            return Newtonsoft.Json.JsonConvert.DeserializeObject<MonthResponse>(data);
        }

        public event System.ComponentModel.PropertyChangedEventHandler PropertyChanged;

        protected virtual void RaisePropertyChanged([System.Runtime.CompilerServices.CallerMemberName] string propertyName = null)
        {
            var handler = PropertyChanged;
            if (handler != null)
                handler(this, new System.ComponentModel.PropertyChangedEventArgs(propertyName));
        }

    }

    public partial class YearResponse : System.ComponentModel.INotifyPropertyChanged
    {
        private OpResult _status;
        private YearPunchesDto _punches;

        [Newtonsoft.Json.JsonProperty("status", Required = Newtonsoft.Json.Required.Default, NullValueHandling = Newtonsoft.Json.NullValueHandling.Ignore)]
        public OpResult Status
        {
            get { return _status; }
            set
            {
                if (_status != value)
                {
                    _status = value;
                    RaisePropertyChanged();
                }
            }
        }

        [Newtonsoft.Json.JsonProperty("punches", Required = Newtonsoft.Json.Required.Default, NullValueHandling = Newtonsoft.Json.NullValueHandling.Ignore)]
        public YearPunchesDto Punches
        {
            get { return _punches; }
            set
            {
                if (_punches != value)
                {
                    _punches = value;
                    RaisePropertyChanged();
                }
            }
        }

        public string ToJson()
        {
            return Newtonsoft.Json.JsonConvert.SerializeObject(this);
        }

        public static YearResponse FromJson(string data)
        {
            return Newtonsoft.Json.JsonConvert.DeserializeObject<YearResponse>(data);
        }

        public event System.ComponentModel.PropertyChangedEventHandler PropertyChanged;

        protected virtual void RaisePropertyChanged([System.Runtime.CompilerServices.CallerMemberName] string propertyName = null)
        {
            var handler = PropertyChanged;
            if (handler != null)
                handler(this, new System.ComponentModel.PropertyChangedEventArgs(propertyName));
        }

    }

    public partial class ModifyPunchDto : System.ComponentModel.INotifyPropertyChanged
    {
        private string _punchid;
        private double? _timedec;
        private bool? _direction;

        [Newtonsoft.Json.JsonProperty("punchid", Required = Newtonsoft.Json.Required.Default, NullValueHandling = Newtonsoft.Json.NullValueHandling.Ignore)]
        public string Punchid
        {
            get { return _punchid; }
            set
            {
                if (_punchid != value)
                {
                    _punchid = value;
                    RaisePropertyChanged();
                }
            }
        }

        [Newtonsoft.Json.JsonProperty("timedec", Required = Newtonsoft.Json.Required.Default, NullValueHandling = Newtonsoft.Json.NullValueHandling.Ignore)]
        public double? Timedec
        {
            get { return _timedec; }
            set
            {
                if (_timedec != value)
                {
                    _timedec = value;
                    RaisePropertyChanged();
                }
            }
        }

        [Newtonsoft.Json.JsonProperty("direction", Required = Newtonsoft.Json.Required.Default, NullValueHandling = Newtonsoft.Json.NullValueHandling.Ignore)]
        public bool? Direction
        {
            get { return _direction; }
            set
            {
                if (_direction != value)
                {
                    _direction = value;
                    RaisePropertyChanged();
                }
            }
        }

        public string ToJson()
        {
            return Newtonsoft.Json.JsonConvert.SerializeObject(this);
        }

        public static ModifyPunchDto FromJson(string data)
        {
            return Newtonsoft.Json.JsonConvert.DeserializeObject<ModifyPunchDto>(data);
        }

        public event System.ComponentModel.PropertyChangedEventHandler PropertyChanged;

        protected virtual void RaisePropertyChanged([System.Runtime.CompilerServices.CallerMemberName] string propertyName = null)
        {
            var handler = PropertyChanged;
            if (handler != null)
                handler(this, new System.ComponentModel.PropertyChangedEventArgs(propertyName));
        }

    }

    public partial class DeletePunchDto : System.ComponentModel.INotifyPropertyChanged
    {
        private string _punchid;

        [Newtonsoft.Json.JsonProperty("punchid", Required = Newtonsoft.Json.Required.Default, NullValueHandling = Newtonsoft.Json.NullValueHandling.Ignore)]
        public string Punchid
        {
            get { return _punchid; }
            set
            {
                if (_punchid != value)
                {
                    _punchid = value;
                    RaisePropertyChanged();
                }
            }
        }

        public string ToJson()
        {
            return Newtonsoft.Json.JsonConvert.SerializeObject(this);
        }

        public static DeletePunchDto FromJson(string data)
        {
            return Newtonsoft.Json.JsonConvert.DeserializeObject<DeletePunchDto>(data);
        }

        public event System.ComponentModel.PropertyChangedEventHandler PropertyChanged;

        protected virtual void RaisePropertyChanged([System.Runtime.CompilerServices.CallerMemberName] string propertyName = null)
        {
            var handler = PropertyChanged;
            if (handler != null)
                handler(this, new System.ComponentModel.PropertyChangedEventArgs(propertyName));
        }

    }

    public partial class ModifyPunchAdminDto : System.ComponentModel.INotifyPropertyChanged
    {
        private string _punchid;
        private string _userid;
        private double? _timedec;
        private bool? _direction;

        [Newtonsoft.Json.JsonProperty("punchid", Required = Newtonsoft.Json.Required.Default, NullValueHandling = Newtonsoft.Json.NullValueHandling.Ignore)]
        public string Punchid
        {
            get { return _punchid; }
            set
            {
                if (_punchid != value)
                {
                    _punchid = value;
                    RaisePropertyChanged();
                }
            }
        }

        [Newtonsoft.Json.JsonProperty("userid", Required = Newtonsoft.Json.Required.Default, NullValueHandling = Newtonsoft.Json.NullValueHandling.Ignore)]
        public string Userid
        {
            get { return _userid; }
            set
            {
                if (_userid != value)
                {
                    _userid = value;
                    RaisePropertyChanged();
                }
            }
        }

        [Newtonsoft.Json.JsonProperty("timedec", Required = Newtonsoft.Json.Required.Default, NullValueHandling = Newtonsoft.Json.NullValueHandling.Ignore)]
        public double? Timedec
        {
            get { return _timedec; }
            set
            {
                if (_timedec != value)
                {
                    _timedec = value;
                    RaisePropertyChanged();
                }
            }
        }

        [Newtonsoft.Json.JsonProperty("direction", Required = Newtonsoft.Json.Required.Default, NullValueHandling = Newtonsoft.Json.NullValueHandling.Ignore)]
        public bool? Direction
        {
            get { return _direction; }
            set
            {
                if (_direction != value)
                {
                    _direction = value;
                    RaisePropertyChanged();
                }
            }
        }

        public string ToJson()
        {
            return Newtonsoft.Json.JsonConvert.SerializeObject(this);
        }

        public static ModifyPunchAdminDto FromJson(string data)
        {
            return Newtonsoft.Json.JsonConvert.DeserializeObject<ModifyPunchAdminDto>(data);
        }

        public event System.ComponentModel.PropertyChangedEventHandler PropertyChanged;

        protected virtual void RaisePropertyChanged([System.Runtime.CompilerServices.CallerMemberName] string propertyName = null)
        {
            var handler = PropertyChanged;
            if (handler != null)
                handler(this, new System.ComponentModel.PropertyChangedEventArgs(propertyName));
        }

    }

    public partial class StatusAdminDto : System.ComponentModel.INotifyPropertyChanged
    {
        private string _userid;
        private StatusAdminDtoStatus? _status = TpDotNetCore.Controllers.StatusAdminDtoStatus.Open;
        private int? _month;
        private int? _year;

        [Newtonsoft.Json.JsonProperty("userid", Required = Newtonsoft.Json.Required.Default, NullValueHandling = Newtonsoft.Json.NullValueHandling.Ignore)]
        public string Userid
        {
            get { return _userid; }
            set
            {
                if (_userid != value)
                {
                    _userid = value;
                    RaisePropertyChanged();
                }
            }
        }

        /// <summary>The month status</summary>
        [Newtonsoft.Json.JsonProperty("status", Required = Newtonsoft.Json.Required.Default, NullValueHandling = Newtonsoft.Json.NullValueHandling.Ignore)]
        [Newtonsoft.Json.JsonConverter(typeof(Newtonsoft.Json.Converters.StringEnumConverter))]
        public StatusAdminDtoStatus? Status
        {
            get { return _status; }
            set
            {
                if (_status != value)
                {
                    _status = value;
                    RaisePropertyChanged();
                }
            }
        }

        /// <summary>The month expressed as value between 1 and 12</summary>
        [Newtonsoft.Json.JsonProperty("month", Required = Newtonsoft.Json.Required.Default, NullValueHandling = Newtonsoft.Json.NullValueHandling.Ignore)]
        public int? Month
        {
            get { return _month; }
            set
            {
                if (_month != value)
                {
                    _month = value;
                    RaisePropertyChanged();
                }
            }
        }

        /// <summary>The year expressed as 1 to 9999</summary>
        [Newtonsoft.Json.JsonProperty("year", Required = Newtonsoft.Json.Required.Default, NullValueHandling = Newtonsoft.Json.NullValueHandling.Ignore)]
        public int? Year
        {
            get { return _year; }
            set
            {
                if (_year != value)
                {
                    _year = value;
                    RaisePropertyChanged();
                }
            }
        }

        public string ToJson()
        {
            return Newtonsoft.Json.JsonConvert.SerializeObject(this);
        }

        public static StatusAdminDto FromJson(string data)
        {
            return Newtonsoft.Json.JsonConvert.DeserializeObject<StatusAdminDto>(data);
        }

        public event System.ComponentModel.PropertyChangedEventHandler PropertyChanged;

        protected virtual void RaisePropertyChanged([System.Runtime.CompilerServices.CallerMemberName] string propertyName = null)
        {
            var handler = PropertyChanged;
            if (handler != null)
                handler(this, new System.ComponentModel.PropertyChangedEventArgs(propertyName));
        }

    }

    public partial class UsersDto : System.ComponentModel.INotifyPropertyChanged
    {
        private System.Collections.Generic.List<UserDto> _users;

        [Newtonsoft.Json.JsonProperty("users", Required = Newtonsoft.Json.Required.Default, NullValueHandling = Newtonsoft.Json.NullValueHandling.Ignore)]
        public System.Collections.Generic.List<UserDto> Users
        {
            get { return _users; }
            set
            {
                if (_users != value)
                {
                    _users = value;
                    RaisePropertyChanged();
                }
            }
        }

        public string ToJson()
        {
            return Newtonsoft.Json.JsonConvert.SerializeObject(this);
        }

        public static UsersDto FromJson(string data)
        {
            return Newtonsoft.Json.JsonConvert.DeserializeObject<UsersDto>(data);
        }

        public event System.ComponentModel.PropertyChangedEventHandler PropertyChanged;

        protected virtual void RaisePropertyChanged([System.Runtime.CompilerServices.CallerMemberName] string propertyName = null)
        {
            var handler = PropertyChanged;
            if (handler != null)
                handler(this, new System.ComponentModel.PropertyChangedEventArgs(propertyName));
        }

    }

    public partial class UserDto : System.ComponentModel.INotifyPropertyChanged
    {
        private string _id;
        private string _firstName;
        private string _lastName;
        private string _email;
        private bool? _emailConfirmed;
        private double? _accessFailedCount;
        private System.Collections.Generic.List<RoleDto> _roleNames;

        /// <summary>The user id</summary>
        [Newtonsoft.Json.JsonProperty("id", Required = Newtonsoft.Json.Required.Default, NullValueHandling = Newtonsoft.Json.NullValueHandling.Ignore)]
        public string Id
        {
            get { return _id; }
            set
            {
                if (_id != value)
                {
                    _id = value;
                    RaisePropertyChanged();
                }
            }
        }

        /// <summary>The first name of user</summary>
        [Newtonsoft.Json.JsonProperty("firstName", Required = Newtonsoft.Json.Required.Default, NullValueHandling = Newtonsoft.Json.NullValueHandling.Ignore)]
        public string FirstName
        {
            get { return _firstName; }
            set
            {
                if (_firstName != value)
                {
                    _firstName = value;
                    RaisePropertyChanged();
                }
            }
        }

        /// <summary>The last name of user</summary>
        [Newtonsoft.Json.JsonProperty("lastName", Required = Newtonsoft.Json.Required.Default, NullValueHandling = Newtonsoft.Json.NullValueHandling.Ignore)]
        public string LastName
        {
            get { return _lastName; }
            set
            {
                if (_lastName != value)
                {
                    _lastName = value;
                    RaisePropertyChanged();
                }
            }
        }

        /// <summary>The email of the user</summary>
        [Newtonsoft.Json.JsonProperty("email", Required = Newtonsoft.Json.Required.Default, NullValueHandling = Newtonsoft.Json.NullValueHandling.Ignore)]
        public string Email
        {
            get { return _email; }
            set
            {
                if (_email != value)
                {
                    _email = value;
                    RaisePropertyChanged();
                }
            }
        }

        /// <summary>The confirmed status of the user registration</summary>
        [Newtonsoft.Json.JsonProperty("emailConfirmed", Required = Newtonsoft.Json.Required.Default, NullValueHandling = Newtonsoft.Json.NullValueHandling.Ignore)]
        public bool? EmailConfirmed
        {
            get { return _emailConfirmed; }
            set
            {
                if (_emailConfirmed != value)
                {
                    _emailConfirmed = value;
                    RaisePropertyChanged();
                }
            }
        }

        /// <summary>The number of failed access attempts</summary>
        [Newtonsoft.Json.JsonProperty("accessFailedCount", Required = Newtonsoft.Json.Required.Default, NullValueHandling = Newtonsoft.Json.NullValueHandling.Ignore)]
        public double? AccessFailedCount
        {
            get { return _accessFailedCount; }
            set
            {
                if (_accessFailedCount != value)
                {
                    _accessFailedCount = value;
                    RaisePropertyChanged();
                }
            }
        }

        [Newtonsoft.Json.JsonProperty("roleNames", Required = Newtonsoft.Json.Required.Default, NullValueHandling = Newtonsoft.Json.NullValueHandling.Ignore)]
        public System.Collections.Generic.List<RoleDto> RoleNames
        {
            get { return _roleNames; }
            set
            {
                if (_roleNames != value)
                {
                    _roleNames = value;
                    RaisePropertyChanged();
                }
            }
        }

        public string ToJson()
        {
            return Newtonsoft.Json.JsonConvert.SerializeObject(this);
        }

        public static UserDto FromJson(string data)
        {
            return Newtonsoft.Json.JsonConvert.DeserializeObject<UserDto>(data);
        }

        public event System.ComponentModel.PropertyChangedEventHandler PropertyChanged;

        protected virtual void RaisePropertyChanged([System.Runtime.CompilerServices.CallerMemberName] string propertyName = null)
        {
            var handler = PropertyChanged;
            if (handler != null)
                handler(this, new System.ComponentModel.PropertyChangedEventArgs(propertyName));
        }

    }

    public partial class RoleDto : System.ComponentModel.INotifyPropertyChanged
    {
        private string _name;

        /// <summary>Name of role</summary>
        [Newtonsoft.Json.JsonProperty("name", Required = Newtonsoft.Json.Required.Default, NullValueHandling = Newtonsoft.Json.NullValueHandling.Ignore)]
        public string Name
        {
            get { return _name; }
            set
            {
                if (_name != value)
                {
                    _name = value;
                    RaisePropertyChanged();
                }
            }
        }

        public string ToJson()
        {
            return Newtonsoft.Json.JsonConvert.SerializeObject(this);
        }

        public static RoleDto FromJson(string data)
        {
            return Newtonsoft.Json.JsonConvert.DeserializeObject<RoleDto>(data);
        }

        public event System.ComponentModel.PropertyChangedEventHandler PropertyChanged;

        protected virtual void RaisePropertyChanged([System.Runtime.CompilerServices.CallerMemberName] string propertyName = null)
        {
            var handler = PropertyChanged;
            if (handler != null)
                handler(this, new System.ComponentModel.PropertyChangedEventArgs(propertyName));
        }

    }

    public partial class SessionsDto : System.ComponentModel.INotifyPropertyChanged
    {
        private System.Collections.Generic.List<SessionDto> _sessions;

        [Newtonsoft.Json.JsonProperty("sessions", Required = Newtonsoft.Json.Required.Default, NullValueHandling = Newtonsoft.Json.NullValueHandling.Ignore)]
        public System.Collections.Generic.List<SessionDto> Sessions
        {
            get { return _sessions; }
            set
            {
                if (_sessions != value)
                {
                    _sessions = value;
                    RaisePropertyChanged();
                }
            }
        }

        public string ToJson()
        {
            return Newtonsoft.Json.JsonConvert.SerializeObject(this);
        }

        public static SessionsDto FromJson(string data)
        {
            return Newtonsoft.Json.JsonConvert.DeserializeObject<SessionsDto>(data);
        }

        public event System.ComponentModel.PropertyChangedEventHandler PropertyChanged;

        protected virtual void RaisePropertyChanged([System.Runtime.CompilerServices.CallerMemberName] string propertyName = null)
        {
            var handler = PropertyChanged;
            if (handler != null)
                handler(this, new System.ComponentModel.PropertyChangedEventArgs(propertyName));
        }

    }

    public partial class SessionDto : System.ComponentModel.INotifyPropertyChanged
    {
        private string _id;
        private string _userid;
        private string _email;
        private string _created;
        private bool? _isStop;

        /// <summary>Then sessions id</summary>
        [Newtonsoft.Json.JsonProperty("id", Required = Newtonsoft.Json.Required.Default, NullValueHandling = Newtonsoft.Json.NullValueHandling.Ignore)]
        public string Id
        {
            get { return _id; }
            set
            {
                if (_id != value)
                {
                    _id = value;
                    RaisePropertyChanged();
                }
            }
        }

        /// <summary>The userid associated with the session</summary>
        [Newtonsoft.Json.JsonProperty("userid", Required = Newtonsoft.Json.Required.Default, NullValueHandling = Newtonsoft.Json.NullValueHandling.Ignore)]
        public string Userid
        {
            get { return _userid; }
            set
            {
                if (_userid != value)
                {
                    _userid = value;
                    RaisePropertyChanged();
                }
            }
        }

        /// <summary>the email of the user</summary>
        [Newtonsoft.Json.JsonProperty("email", Required = Newtonsoft.Json.Required.Default, NullValueHandling = Newtonsoft.Json.NullValueHandling.Ignore)]
        public string Email
        {
            get { return _email; }
            set
            {
                if (_email != value)
                {
                    _email = value;
                    RaisePropertyChanged();
                }
            }
        }

        /// <summary>The timestamp of the creation</summary>
        [Newtonsoft.Json.JsonProperty("created", Required = Newtonsoft.Json.Required.Default, NullValueHandling = Newtonsoft.Json.NullValueHandling.Ignore)]
        public string Created
        {
            get { return _created; }
            set
            {
                if (_created != value)
                {
                    _created = value;
                    RaisePropertyChanged();
                }
            }
        }

        /// <summary>True if the session is stopped</summary>
        [Newtonsoft.Json.JsonProperty("isStop", Required = Newtonsoft.Json.Required.Default, NullValueHandling = Newtonsoft.Json.NullValueHandling.Ignore)]
        public bool? IsStop
        {
            get { return _isStop; }
            set
            {
                if (_isStop != value)
                {
                    _isStop = value;
                    RaisePropertyChanged();
                }
            }
        }

        public string ToJson()
        {
            return Newtonsoft.Json.JsonConvert.SerializeObject(this);
        }

        public static SessionDto FromJson(string data)
        {
            return Newtonsoft.Json.JsonConvert.DeserializeObject<SessionDto>(data);
        }

        public event System.ComponentModel.PropertyChangedEventHandler PropertyChanged;

        protected virtual void RaisePropertyChanged([System.Runtime.CompilerServices.CallerMemberName] string propertyName = null)
        {
            var handler = PropertyChanged;
            if (handler != null)
                handler(this, new System.ComponentModel.PropertyChangedEventArgs(propertyName));
        }

    }

    public partial class MailDto : System.ComponentModel.INotifyPropertyChanged
    {
        private string _subject;
        private string _body;

        /// <summary>The mail subject</summary>
        [Newtonsoft.Json.JsonProperty("subject", Required = Newtonsoft.Json.Required.Default, NullValueHandling = Newtonsoft.Json.NullValueHandling.Ignore)]
        public string Subject
        {
            get { return _subject; }
            set
            {
                if (_subject != value)
                {
                    _subject = value;
                    RaisePropertyChanged();
                }
            }
        }

        /// <summary>The body text</summary>
        [Newtonsoft.Json.JsonProperty("body", Required = Newtonsoft.Json.Required.Default, NullValueHandling = Newtonsoft.Json.NullValueHandling.Ignore)]
        public string Body
        {
            get { return _body; }
            set
            {
                if (_body != value)
                {
                    _body = value;
                    RaisePropertyChanged();
                }
            }
        }

        public string ToJson()
        {
            return Newtonsoft.Json.JsonConvert.SerializeObject(this);
        }

        public static MailDto FromJson(string data)
        {
            return Newtonsoft.Json.JsonConvert.DeserializeObject<MailDto>(data);
        }

        public event System.ComponentModel.PropertyChangedEventHandler PropertyChanged;

        protected virtual void RaisePropertyChanged([System.Runtime.CompilerServices.CallerMemberName] string propertyName = null)
        {
            var handler = PropertyChanged;
            if (handler != null)
                handler(this, new System.ComponentModel.PropertyChangedEventArgs(propertyName));
        }

    }

    public partial class YearPunchesDto : System.ComponentModel.INotifyPropertyChanged
    {
        private string _user;
        private int? _year;
        private System.Collections.Generic.List<MonthPunchesDto> _punches;

        /// <summary>Boid of user</summary>
        [Newtonsoft.Json.JsonProperty("user", Required = Newtonsoft.Json.Required.Default, NullValueHandling = Newtonsoft.Json.NullValueHandling.Ignore)]
        public string User
        {
            get { return _user; }
            set
            {
                if (_user != value)
                {
                    _user = value;
                    RaisePropertyChanged();
                }
            }
        }

        /// <summary>The year expressed as 1 to 9999</summary>
        [Newtonsoft.Json.JsonProperty("year", Required = Newtonsoft.Json.Required.Default, NullValueHandling = Newtonsoft.Json.NullValueHandling.Ignore)]
        public int? Year
        {
            get { return _year; }
            set
            {
                if (_year != value)
                {
                    _year = value;
                    RaisePropertyChanged();
                }
            }
        }

        [Newtonsoft.Json.JsonProperty("punches", Required = Newtonsoft.Json.Required.Default, NullValueHandling = Newtonsoft.Json.NullValueHandling.Ignore)]
        public System.Collections.Generic.List<MonthPunchesDto> Punches
        {
            get { return _punches; }
            set
            {
                if (_punches != value)
                {
                    _punches = value;
                    RaisePropertyChanged();
                }
            }
        }

        public string ToJson()
        {
            return Newtonsoft.Json.JsonConvert.SerializeObject(this);
        }

        public static YearPunchesDto FromJson(string data)
        {
            return Newtonsoft.Json.JsonConvert.DeserializeObject<YearPunchesDto>(data);
        }

        public event System.ComponentModel.PropertyChangedEventHandler PropertyChanged;

        protected virtual void RaisePropertyChanged([System.Runtime.CompilerServices.CallerMemberName] string propertyName = null)
        {
            var handler = PropertyChanged;
            if (handler != null)
                handler(this, new System.ComponentModel.PropertyChangedEventArgs(propertyName));
        }

    }

    public partial class MonthPunchesDto : System.ComponentModel.INotifyPropertyChanged
    {
        private string _user;
        private StatusAdminDto _state;
        private int? _month;
        private int? _year;
        private System.Collections.Generic.List<DayPunchesDto> _punches;

        /// <summary>Boid of user</summary>
        [Newtonsoft.Json.JsonProperty("user", Required = Newtonsoft.Json.Required.Default, NullValueHandling = Newtonsoft.Json.NullValueHandling.Ignore)]
        public string User
        {
            get { return _user; }
            set
            {
                if (_user != value)
                {
                    _user = value;
                    RaisePropertyChanged();
                }
            }
        }

        [Newtonsoft.Json.JsonProperty("state", Required = Newtonsoft.Json.Required.Default, NullValueHandling = Newtonsoft.Json.NullValueHandling.Ignore)]
        public StatusAdminDto State
        {
            get { return _state; }
            set
            {
                if (_state != value)
                {
                    _state = value;
                    RaisePropertyChanged();
                }
            }
        }

        /// <summary>The month expressed as value between 1 and 12</summary>
        [Newtonsoft.Json.JsonProperty("month", Required = Newtonsoft.Json.Required.Default, NullValueHandling = Newtonsoft.Json.NullValueHandling.Ignore)]
        public int? Month
        {
            get { return _month; }
            set
            {
                if (_month != value)
                {
                    _month = value;
                    RaisePropertyChanged();
                }
            }
        }

        /// <summary>The year expressed as 1 to 9999</summary>
        [Newtonsoft.Json.JsonProperty("year", Required = Newtonsoft.Json.Required.Default, NullValueHandling = Newtonsoft.Json.NullValueHandling.Ignore)]
        public int? Year
        {
            get { return _year; }
            set
            {
                if (_year != value)
                {
                    _year = value;
                    RaisePropertyChanged();
                }
            }
        }

        [Newtonsoft.Json.JsonProperty("punches", Required = Newtonsoft.Json.Required.Default, NullValueHandling = Newtonsoft.Json.NullValueHandling.Ignore)]
        public System.Collections.Generic.List<DayPunchesDto> Punches
        {
            get { return _punches; }
            set
            {
                if (_punches != value)
                {
                    _punches = value;
                    RaisePropertyChanged();
                }
            }
        }

        public string ToJson()
        {
            return Newtonsoft.Json.JsonConvert.SerializeObject(this);
        }

        public static MonthPunchesDto FromJson(string data)
        {
            return Newtonsoft.Json.JsonConvert.DeserializeObject<MonthPunchesDto>(data);
        }

        public event System.ComponentModel.PropertyChangedEventHandler PropertyChanged;

        protected virtual void RaisePropertyChanged([System.Runtime.CompilerServices.CallerMemberName] string propertyName = null)
        {
            var handler = PropertyChanged;
            if (handler != null)
                handler(this, new System.ComponentModel.PropertyChangedEventArgs(propertyName));
        }

    }

    public partial class WeekPunchesDto : System.ComponentModel.INotifyPropertyChanged
    {
        private string _user;
        private int? _week;
        private int? _year;
        private System.Collections.Generic.List<DayPunchesDto> _dayPunches;

        /// <summary>Boid of user</summary>
        [Newtonsoft.Json.JsonProperty("user", Required = Newtonsoft.Json.Required.Default, NullValueHandling = Newtonsoft.Json.NullValueHandling.Ignore)]
        public string User
        {
            get { return _user; }
            set
            {
                if (_user != value)
                {
                    _user = value;
                    RaisePropertyChanged();
                }
            }
        }

        /// <summary>The week expressed as 1 to 53</summary>
        [Newtonsoft.Json.JsonProperty("week", Required = Newtonsoft.Json.Required.Default, NullValueHandling = Newtonsoft.Json.NullValueHandling.Ignore)]
        public int? Week
        {
            get { return _week; }
            set
            {
                if (_week != value)
                {
                    _week = value;
                    RaisePropertyChanged();
                }
            }
        }

        /// <summary>The year expressed as 1 to 9999</summary>
        [Newtonsoft.Json.JsonProperty("year", Required = Newtonsoft.Json.Required.Default, NullValueHandling = Newtonsoft.Json.NullValueHandling.Ignore)]
        public int? Year
        {
            get { return _year; }
            set
            {
                if (_year != value)
                {
                    _year = value;
                    RaisePropertyChanged();
                }
            }
        }

        [Newtonsoft.Json.JsonProperty("dayPunches", Required = Newtonsoft.Json.Required.Default, NullValueHandling = Newtonsoft.Json.NullValueHandling.Ignore)]
        public System.Collections.Generic.List<DayPunchesDto> DayPunches
        {
            get { return _dayPunches; }
            set
            {
                if (_dayPunches != value)
                {
                    _dayPunches = value;
                    RaisePropertyChanged();
                }
            }
        }

        public string ToJson()
        {
            return Newtonsoft.Json.JsonConvert.SerializeObject(this);
        }

        public static WeekPunchesDto FromJson(string data)
        {
            return Newtonsoft.Json.JsonConvert.DeserializeObject<WeekPunchesDto>(data);
        }

        public event System.ComponentModel.PropertyChangedEventHandler PropertyChanged;

        protected virtual void RaisePropertyChanged([System.Runtime.CompilerServices.CallerMemberName] string propertyName = null)
        {
            var handler = PropertyChanged;
            if (handler != null)
                handler(this, new System.ComponentModel.PropertyChangedEventArgs(propertyName));
        }

    }

    public partial class DayPunchesDto : System.ComponentModel.INotifyPropertyChanged
    {
        private string _userboid;
        private int? _day;
        private int? _month;
        private int? _year;
        private System.Collections.Generic.List<PunchRowDto> _punches;
        private double? _daytotal;

        /// <summary>Boid of user</summary>
        [Newtonsoft.Json.JsonProperty("userboid", Required = Newtonsoft.Json.Required.Default, NullValueHandling = Newtonsoft.Json.NullValueHandling.Ignore)]
        public string Userboid
        {
            get { return _userboid; }
            set
            {
                if (_userboid != value)
                {
                    _userboid = value;
                    RaisePropertyChanged();
                }
            }
        }

        /// <summary>The day expressed as value betwenn 1 and 31</summary>
        [Newtonsoft.Json.JsonProperty("day", Required = Newtonsoft.Json.Required.Default, NullValueHandling = Newtonsoft.Json.NullValueHandling.Ignore)]
        public int? Day
        {
            get { return _day; }
            set
            {
                if (_day != value)
                {
                    _day = value;
                    RaisePropertyChanged();
                }
            }
        }

        /// <summary>The month expressed as value between 1 and 12</summary>
        [Newtonsoft.Json.JsonProperty("month", Required = Newtonsoft.Json.Required.Default, NullValueHandling = Newtonsoft.Json.NullValueHandling.Ignore)]
        public int? Month
        {
            get { return _month; }
            set
            {
                if (_month != value)
                {
                    _month = value;
                    RaisePropertyChanged();
                }
            }
        }

        /// <summary>The year expressed as 1 to 9999</summary>
        [Newtonsoft.Json.JsonProperty("year", Required = Newtonsoft.Json.Required.Default, NullValueHandling = Newtonsoft.Json.NullValueHandling.Ignore)]
        public int? Year
        {
            get { return _year; }
            set
            {
                if (_year != value)
                {
                    _year = value;
                    RaisePropertyChanged();
                }
            }
        }

        [Newtonsoft.Json.JsonProperty("punches", Required = Newtonsoft.Json.Required.Default, NullValueHandling = Newtonsoft.Json.NullValueHandling.Ignore)]
        public System.Collections.Generic.List<PunchRowDto> Punches
        {
            get { return _punches; }
            set
            {
                if (_punches != value)
                {
                    _punches = value;
                    RaisePropertyChanged();
                }
            }
        }

        [Newtonsoft.Json.JsonProperty("daytotal", Required = Newtonsoft.Json.Required.Default, NullValueHandling = Newtonsoft.Json.NullValueHandling.Ignore)]
        public double? Daytotal
        {
            get { return _daytotal; }
            set
            {
                if (_daytotal != value)
                {
                    _daytotal = value;
                    RaisePropertyChanged();
                }
            }
        }

        public string ToJson()
        {
            return Newtonsoft.Json.JsonConvert.SerializeObject(this);
        }

        public static DayPunchesDto FromJson(string data)
        {
            return Newtonsoft.Json.JsonConvert.DeserializeObject<DayPunchesDto>(data);
        }

        public event System.ComponentModel.PropertyChangedEventHandler PropertyChanged;

        protected virtual void RaisePropertyChanged([System.Runtime.CompilerServices.CallerMemberName] string propertyName = null)
        {
            var handler = PropertyChanged;
            if (handler != null)
                handler(this, new System.ComponentModel.PropertyChangedEventArgs(propertyName));
        }

    }

    public partial class PunchRowDto : System.ComponentModel.INotifyPropertyChanged
    {
        private PunchDto _enter;
        private PunchDto _leave;
        private double? _rowTotal;

        [Newtonsoft.Json.JsonProperty("enter", Required = Newtonsoft.Json.Required.Default, NullValueHandling = Newtonsoft.Json.NullValueHandling.Ignore)]
        public PunchDto Enter
        {
            get { return _enter; }
            set
            {
                if (_enter != value)
                {
                    _enter = value;
                    RaisePropertyChanged();
                }
            }
        }

        [Newtonsoft.Json.JsonProperty("leave", Required = Newtonsoft.Json.Required.Default, NullValueHandling = Newtonsoft.Json.NullValueHandling.Ignore)]
        public PunchDto Leave
        {
            get { return _leave; }
            set
            {
                if (_leave != value)
                {
                    _leave = value;
                    RaisePropertyChanged();
                }
            }
        }

        /// <summary>Time between enter and leav</summary>
        [Newtonsoft.Json.JsonProperty("rowTotal", Required = Newtonsoft.Json.Required.Default, NullValueHandling = Newtonsoft.Json.NullValueHandling.Ignore)]
        public double? RowTotal
        {
            get { return _rowTotal; }
            set
            {
                if (_rowTotal != value)
                {
                    _rowTotal = value;
                    RaisePropertyChanged();
                }
            }
        }

        public string ToJson()
        {
            return Newtonsoft.Json.JsonConvert.SerializeObject(this);
        }

        public static PunchRowDto FromJson(string data)
        {
            return Newtonsoft.Json.JsonConvert.DeserializeObject<PunchRowDto>(data);
        }

        public event System.ComponentModel.PropertyChangedEventHandler PropertyChanged;

        protected virtual void RaisePropertyChanged([System.Runtime.CompilerServices.CallerMemberName] string propertyName = null)
        {
            var handler = PropertyChanged;
            if (handler != null)
                handler(this, new System.ComponentModel.PropertyChangedEventArgs(propertyName));
        }

    }

    public partial class PunchDto : System.ComponentModel.INotifyPropertyChanged
    {
        private System.DateTime? _time;
        private double? _timedec;
        private bool? _direction;
        private System.DateTime? _created;
        private System.DateTime? _updated;
        private string _punchid;

        [Newtonsoft.Json.JsonProperty("time", Required = Newtonsoft.Json.Required.Default, NullValueHandling = Newtonsoft.Json.NullValueHandling.Ignore)]
        public System.DateTime? Time
        {
            get { return _time; }
            set
            {
                if (_time != value)
                {
                    _time = value;
                    RaisePropertyChanged();
                }
            }
        }

        [Newtonsoft.Json.JsonProperty("timedec", Required = Newtonsoft.Json.Required.Default, NullValueHandling = Newtonsoft.Json.NullValueHandling.Ignore)]
        public double? Timedec
        {
            get { return _timedec; }
            set
            {
                if (_timedec != value)
                {
                    _timedec = value;
                    RaisePropertyChanged();
                }
            }
        }

        /// <summary>True means enter work, False means leave work.</summary>
        [Newtonsoft.Json.JsonProperty("direction", Required = Newtonsoft.Json.Required.Default, NullValueHandling = Newtonsoft.Json.NullValueHandling.Ignore)]
        public bool? Direction
        {
            get { return _direction; }
            set
            {
                if (_direction != value)
                {
                    _direction = value;
                    RaisePropertyChanged();
                }
            }
        }

        /// <summary>The timestamp of the creation of this value.</summary>
        [Newtonsoft.Json.JsonProperty("created", Required = Newtonsoft.Json.Required.Default, NullValueHandling = Newtonsoft.Json.NullValueHandling.Ignore)]
        public System.DateTime? Created
        {
            get { return _created; }
            set
            {
                if (_created != value)
                {
                    _created = value;
                    RaisePropertyChanged();
                }
            }
        }

        /// <summary>The timestamp of the last update of this value.</summary>
        [Newtonsoft.Json.JsonProperty("updated", Required = Newtonsoft.Json.Required.Default, NullValueHandling = Newtonsoft.Json.NullValueHandling.Ignore)]
        public System.DateTime? Updated
        {
            get { return _updated; }
            set
            {
                if (_updated != value)
                {
                    _updated = value;
                    RaisePropertyChanged();
                }
            }
        }

        [Newtonsoft.Json.JsonProperty("punchid", Required = Newtonsoft.Json.Required.Default, NullValueHandling = Newtonsoft.Json.NullValueHandling.Ignore)]
        public string Punchid
        {
            get { return _punchid; }
            set
            {
                if (_punchid != value)
                {
                    _punchid = value;
                    RaisePropertyChanged();
                }
            }
        }

        public string ToJson()
        {
            return Newtonsoft.Json.JsonConvert.SerializeObject(this);
        }

        public static PunchDto FromJson(string data)
        {
            return Newtonsoft.Json.JsonConvert.DeserializeObject<PunchDto>(data);
        }

        public event System.ComponentModel.PropertyChangedEventHandler PropertyChanged;

        protected virtual void RaisePropertyChanged([System.Runtime.CompilerServices.CallerMemberName] string propertyName = null)
        {
            var handler = PropertyChanged;
            if (handler != null)
                handler(this, new System.ComponentModel.PropertyChangedEventArgs(propertyName));
        }

    }

    public partial class OpResult : System.ComponentModel.INotifyPropertyChanged
    {
        private bool? _success;
        private string _result;

        /// <summary>True wenn die Operation erfolgreich war</summary>
        [Newtonsoft.Json.JsonProperty("success", Required = Newtonsoft.Json.Required.Default, NullValueHandling = Newtonsoft.Json.NullValueHandling.Ignore)]
        public bool? Success
        {
            get { return _success; }
            set
            {
                if (_success != value)
                {
                    _success = value;
                    RaisePropertyChanged();
                }
            }
        }

        /// <summary>Eine Text-Meldung</summary>
        [Newtonsoft.Json.JsonProperty("result", Required = Newtonsoft.Json.Required.Default, NullValueHandling = Newtonsoft.Json.NullValueHandling.Ignore)]
        public string Result
        {
            get { return _result; }
            set
            {
                if (_result != value)
                {
                    _result = value;
                    RaisePropertyChanged();
                }
            }
        }

        public string ToJson()
        {
            return Newtonsoft.Json.JsonConvert.SerializeObject(this);
        }

        public static OpResult FromJson(string data)
        {
            return Newtonsoft.Json.JsonConvert.DeserializeObject<OpResult>(data);
        }

        public event System.ComponentModel.PropertyChangedEventHandler PropertyChanged;

        protected virtual void RaisePropertyChanged([System.Runtime.CompilerServices.CallerMemberName] string propertyName = null)
        {
            var handler = PropertyChanged;
            if (handler != null)
                handler(this, new System.ComponentModel.PropertyChangedEventArgs(propertyName));
        }

    }

    public enum StatusAdminDtoStatus
    {
        [System.Runtime.Serialization.EnumMember(Value = "open")]
        Open = 0,

        [System.Runtime.Serialization.EnumMember(Value = "openAdmin")]
        OpenAdmin = 1,

        [System.Runtime.Serialization.EnumMember(Value = "closed")]
        Closed = 2,

    }
}