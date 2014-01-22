#!/bin/bash

#install pygraphics
svn checkout https://pygraphics.googlecode.com/svn/trunk/
cd trunk
sudo python setup.py install --user

#install ampy-1.2.3
wget https://pygraphics.googlecode.com/files/ampy-1.2.3.tar.gz
tar -xvf ampy-1.2.3.tar.gz
cd ampy-1.2.3
sudo python setup.py install --user

#install numpy,pygame,imaging
sudo apt-get install  python-imaging-tk python-numpy python-pygame


#install Nose
sudo apt-get install python-nose
