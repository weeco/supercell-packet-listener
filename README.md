# supercell-packet-listener

With this proxy you can easily output the packet metadata sent between the Clash Royale / Brawl Stars game client and game server. Since the packet meta data is not encrypted **we don't need a patched app** here. Perfectly suited for figuring out unknown packet ids.

## Getting started
- Copy the .env.example, rename it to .env and update `TCP_PROXY_POST` and `PROXY_TYPE` (Clash Royale or Brawl Stars)
- Make sure your game device (e. g. your iPad) and your computer are in the same network and can communicate with each other. Update the DNS server in the network settings of your game device - use your computer's network address (in my case 192.168.178.38)
- Start this application (which starts a DNS- and TCP-Server)
- Open Clash Royale / Brawl Stars

### How does it work
This application starts a DNS- and TCP Server. The DNS-Server is capable of returning faked DNS entries. Your device uses our DNS server, which again returns our computer's network ip address for any domains matching this pattern `.*brawlstarsgame.*` or `.*clashroyaleapp.*`. Hence your iPad will connect to your own computer and there we take a peek into the packets and pipe the traffic with the official game server.

## Decrypting the payload
Currently it's not possible to decrypt the payload as this requires patching the game apps. At the moment I am not aware of any ways to permanently patch the public key in Clash Royale or Brawl Stars. Galaxy1036 found a nice workaround by creating a patch which enables the RC4 encryption (see his MITM proxy: https://github.com/Galaxy1036/RC4toSodiumProxy). However Supercell will likely fix this hole with their next major client update.

## Example output
```
23:16:03 - info: Creating DNS Server.
23:16:03 - info: Starting Brawl Stars proxy
23:16:03 - info: DNS Proxy is listening on:  
{ address: '0.0.0.0', family: 'IPv4', port: 53 }
23:16:03 - info: TCP Server is listening on: 
{ address: '0.0.0.0', family: 'IPv4', port: 9339 }
23:16:04 - info: Proxying profile.gc.apple.com
23:16:04 - info: Proxying stats.gc.apple.com
23:16:04 - info: Proxying friend.gc.apple.com
23:16:05 - info: Proxying sp.itunes.apple.com
23:16:06 - info: Fake proxying game.brawlstarsgame.com. Resolving to 192.168.178.37
23:16:06 - info: Client connected
23:16:09 - info: [Client - ClientHello (10100)] Length: 72
23:16:10 - info: [Server - undefined (20100)] Length: 28
23:16:10 - info: [Client - Login (10101)] Length: 403
23:16:10 - info: [Server - LoginOk (20104)] Length: 271
23:16:10 - info: [Server - OwnHomeData (24101)] Length: 9420
23:16:10 - info: [Server - undefined (29001)] Length: 141
23:16:10 - info: Proxying itunes.apple.com
23:16:10 - info: [Server - AllianceStream (24311)] Length: 5759
23:16:10 - info: [Server - AllianceStatus (24399)] Length: 59
23:16:10 - info: [Server - AllianceOnlineStatusUpdated (20207)] Length: 26
23:16:10 - info: [Server - undefined (24364)] Length: 18
23:16:10 - info: [Server - undefined (29001)] Length: 144
23:16:10 - info: [Server - undefined (29001)] Length: 144
23:16:10 - info: [Client - undefined (14366)] Length: 17
23:16:10 - info: Proxying inbox.brawlstars.com
23:16:11 - info: [Client - undefined (19001)] Length: 42
23:16:11 - info: [Client - BindGamecenterAccount (14212)] Length: 393
23:16:11 - info: [Client - undefined (19001)] Length: 42
23:16:11 - info: [Client - undefined (19001)] Length: 39
23:16:15 - info: Proxying www.apple.com
23:16:15 - info: Proxying www.icloud.com
23:16:15 - info: Proxying apple.com
23:16:15 - info: Proxying p47-keyvalueservice.icloud.com
23:16:15 - info: Proxying www.tapatalk.com.org
23:16:15 - info: Proxying gsp-ssl.ls.apple.com
23:16:15 - info: [Client - KeepAlive (10108)] Length: 16
23:16:16 - info: [Server - KeepAliveOk (20108)] Length: 16
23:16:16 - info: [Client - ClientCapabilities (10107)] Length: 18
```

It says `undefined` for unknown packetIds.

## Credits

[Galaxy1036](https://github.com/Galaxy1036) - For sharing his RC4 / Sodium proxy for Clash Royale.

[iGio90](https://github.com/iGio90) - For sharing his knowledge, tools and all his reverse engineering work.

[Knobse aka tryso](https://github.com/knobse) - Reverse engineering, helping out with his Supercell related knowledge whenever I ask him.

[Aperpen](https://github.com/aperpen) - For updating the Clash Royale packet ids for major version 2
