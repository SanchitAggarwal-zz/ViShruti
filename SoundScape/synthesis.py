#!/usr/bin/env python
''' Experiment to generate random location and sound corresponding to those location.
    The following attributes of sound are used to map the 3D location of the  real world:
        Y-Axis or Height (on the scale of -5 0 5 ) : with increasing Pitch of sound.
        X-Axis or Direction (Left or Right) : time duration of the signal within a channel.
        Z-Axis or Depth (on scale of -5 0 5 ) : with amplitude of sound for each channel.
    The produce soundScape for location is being used for training.
    A random test is conducted to check the accuracy of these mapping on Blindfolded people.
    Furthermore Color is also represented using different frequency for each sound.

'''
import sys
import wave
import random
import math
import struct
import argparse
from itertools import *
from numpy import linspace,sin,pi,int16
import pygame
import time
from scipy.io.wavfile import write
from pylab import plot,show,axis
from enum import Enum
import time

__author__ = 'luminous'
#class for generating a random point in real world  #call with initial values
#For only X Point(1,0,0)
#For only Y Point(0,1,0)
#For only Z Point(0,0,1)
filename="static/resource/training.wav"

class Point:
    def __init__(self,x=1,y=1,z=1,step=5,mode=0):
        """
        :param mode: Training Mode = 0, Testing Mode = 1, for generating random numbers
        :param x: X coordinate for channel and duration
        :param y: Y coordinate for pitch
        :param z: Z coordinate for amplitude
        :param step:scale size for each coordinate
        """
        if mode == 0:
            self.x=x
            self.y=y
            self.z=z
        elif mode == 1:
            self.x=random.randint(-1*step,step)
            self.y=random.randint(0,2*step)
            self.z=random.randint(0,2*step)

    def write(self):
        print "x=",self.x,"y=",self.y,"z=",self.z


class SoundScape:
    def __init__(self,rate=44100):

        """
        :param pitch: the standard pitch for sound
        :param rate: No of samples per seconds
        """
        #initial standard 13 tones from A-440 to A-880 increasing pitch
        self.pitch=[440,466,494,523,554,587,622,659,698,740,784,831,880]
        self.rate=rate
        self.Left=1
        self.Right=1

    def generateSineWave(self, point,amp=1000):
        """
        :rtype : sound, the resultant tone
        :param amp: amplitude of the sound signal,initial vale 1000 which increases with depth
        :param step: scale size for each coordinate
        :param point: sine wave corresponding to the 3D point
        :param channel: the channel either Left or Right
        """
        if point.x < 0 :
            self.Right=0   #set the right speaker volume to zero
        elif point.x > 0 :
            self.Left=0    #set the left speaker volume to zero

        self.length=1#+math.fabs(point.x)  // 1 sec tone generation
        self.duration=linspace(0,self.length,self.length*self.rate)
        self.frequency=self.pitch[point.y]
        self.amplitude=amp*(point.z+1)   #double the amplitude for 6db difference
        sound=sin(2*pi*self.frequency*self.duration)*self.amplitude
        print sound
        return sound.astype(int16)

    def write(self):
        amp=(6*self.amplitude)/2000
        print "Duration=",self.length,"sec ","Frequency",self.frequency,"hz ","Amplitude",amp,"dB"


def Experiment(x,y,z, low, high):
    """
    :param x: x axis
    :param y: y axis
    :param z: z axis
    :param low: min range of axis
    :param high: max range of axis
    """
    if x*y*z==1:
        for i in range(low,high):
            X=Point(1,1,1,5,1)
            SS=SoundScape()
            sound = SS.generateSineWave(X)
            write(filename,44100,sound) # writing the sound to a file
            pygame.init()
            snd=pygame.mixer.Sound(filename)
            channel=snd.play()
            channel.set_volume(SS.Left,SS.Right)
            print X.write()
            print SS.write()
            time.sleep(5)
    else:
        for i in range(low,high):
            X=Point(i*x,i*y,i*z)
            SS=SoundScape()
            sound = SS.generateSineWave(X)
            write(filename,44100,sound) # writing the sound to a file
            pygame.init()
            snd=pygame.mixer.Sound(filename)
            channel=snd.play()
            channel.set_volume(SS.Left,SS.Right)
            print X.write()
            print SS.write()
            time.sleep(1)

# Experiment for X axis,generate a tone, X seconds,420 frequency 6dB amplitude 44100 samples per second
#print "Experiment for X axis,generate a tone, X seconds,420 frequency 6dB amplitude 44100 samples per second"
#Experiment(1,0,0,-5,5)

# Experiment for Y axis,generate a tone, 1 seconds,Y frequency 6dB amplitude 44100 samples per second
#print "Experiment for Y axis,generate a tone, 1 seconds,Y frequency 6dB amplitude 44100 samples per second"
#Experiment(0,1,0,0,11)

# Experiment for Z axis,generate a tone, 1 seconds,420 frequency Z*6 dB amplitude 44100 samples per second
#print "Experiment for Z axis,generate a tone, 1 seconds,420 frequency Z*6 dB amplitude 44100 samples per second"
#Experiment(0,0,1,0,11)

#print "Experiment for Random Point and corresponding tone 44100 samples per second"
#Experiment(1,1,1,0,10)


'''time.sleep(10)
plot(SS.duration,sound)
axis([0,0.4,15000,-15000])
show()'''