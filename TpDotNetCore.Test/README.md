# Setup .NET Core Test project

`# mkdir TpDotNetCore.Test`
`# cd TpDotNetCore.Test`

Testprojekt erzeugen
`dotnet new xunit`

Refeerenz auf das zu testende Projekt hinzufügen
`dotnet add ../TpDotNetCore/TpDotNetCore.csproj` reference

`dotnet restore`

Test ausführen

`dotnet test`


https://docs.microsoft.com/de-de/dotnet/core/testing/unit-testing-with-dotnet-test
