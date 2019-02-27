# ts-node-yeelight
Typescript implementation of the original library by [jamesblanksby](https://github.com/jamesblanksby/node-yeelight).
Offers a few classes to interact with Xiaomi Yeelight devices in one's local network.

## Usage
Simply include the Yeelight instance in your typescript files.
```typescript
import { Yeelight } from 'ts-node-yeelight';
``` 

## API
### Fields
|  Field  |       Type       |                                Purpose                                |
|:-------:|:----------------:|:---------------------------------------------------------------------:|
| options | YeelightOptions  | Contains the instance's options. Can be changed after initialization. |
| devices | YeelightDevice[] | Array of ```YeelightDevice```s registered with the instance.          |
### Yeelight(options: IYeelightOptionFields)
All methods are dynamic, which means one needs to first create a new Yeelight instance.
```typescript
const yeelight = new Yeelight();
```
The Yeelight constructor accepts an options object as argument.
```typescript
const options: IYeelightOptionFields = {
    listenPort: 45065,
    listenAddress: '0.0.0.0',
    
    discoveryPort: 1982,
    discoveryAddress: "239.255.255.250",
    discoveryMsg: 'M-SEARCH * HTTP/1.1\r\nMAN: \"ssdp:discover\"\r\nST: wifi_bulb\r\n',
    discoveryTimeoutSeconds: 5,
}
```
All options fields are optional.
### discover()
Sends the message specified in the istance's options to the also specified address and port. Listens for a reply from 
Yeelight devices and proceeds to register each of them in its ```devices``` field. 
### sendMessage(message: string, address: string)
Sends a message to the device specified by the address argument.
### addDevice(device: YeelightDevice)
Adds a pre-populated YeelightDevice to the ```devices``` fields of the instance.
## TODO
There are many functionalities that are yet to be implemented, either from the original library or from ideas
i came up with. Feel free to create an issue if you think a feature has not been implemented or needs some
sort of fixing, and I will look into it as soon as i manage to.
- Change device color
- Change device brightness
- Offer interfaces for low-level interaction (e.g. send a poweroff request with 200ms as transition time)
## Disclaimer
This is my very first public library so I will do my best to keep it maintained. 
## License
(The MIT License)

Copyright (c) 2019 Andrea Silvestroni

Copyright (c) 2016 James Blanksby james@blanks.by

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
