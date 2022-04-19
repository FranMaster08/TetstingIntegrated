import telnetlib
import sys
#TELENET AL HOST XXXX

HOST = sys.argv[1]

tn=telnetlib.Telnet(HOST, 9998)
#TELENET CREDENCIALS
# print('conectandose a telnet ingresando credenciales...')
# tn.read_until(b"Username:",timeout=1)
# tn.write(user123.encode('ascii')+b"\n")
# print('conectandose a telnet ingresando contraseña...')
# tn.read_until(b"Password:",timeout=1)
# tn.write(password123.encode('ascii')+b"\n")
# print('conectado con host')

tn.write('pin 123'.encode('ascii')+ b'\n' )

#Configuration
tn.write(b"exec showdriverhealth\n")
tn.write(b"exit\n")

print(tn.read_all().decode('ascii') )

tn.close()