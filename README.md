WHAT IS SOUND-DROP ?


A software that converts your data into high frequency audio signals and transmit it to a reciever where the audio is recieved & reconverted back to your data. inspired from sound converting into electrical pulses and vice versa.

WORKING UNDERSTANDING 

transmitter has fsk modulation converting data into binary 0&1 and this will binary code will get converted into high frequency sound waves 0 - 18khz & 1 - 19khz. 
this high frequency tone is captured by a reciever , performing fft demodulation converting sound signals to back to binary code back to data.

<br>
what to push on github when i have nothing to push ?

STORYTIME [IGNORE]

1. I wanted to explore different ways of data transfer. So I deep dived into transfer of data via light in optical fibres , via radio waves in bluetooth & wifi , i thought of sound and realised it is a mechanical wave getting converted into electric pulses and vice versa. 
2. This led to me thinking i should build an analogous to airdrop i.e. Sound-Drop , which will use Sound Waves to transfer.
3. Anyone who I told about this idea gave me the feedback of " fun idea but what is the usecase ? what does it solve ? u cannot transfer huge big sized images/videos/files  via sound. i came up with small sized sharing like wifi passwords. But the question again came up : all this hassle of filtering the input sound , maintaining the content in high noise environments just to know that better easy solns like bluetooth , wifi and QR exists. So everybody rejected the idea and I dropped it as well.
4. yet I am creating this repo. Cuz I realised problem solving & building things that have business and real usecase is not always necessary. Somethings can be created just for fun. 
