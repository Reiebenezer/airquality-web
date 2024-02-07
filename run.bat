
echo Cyb: Robotics Air Quality Monitor
color 0a  
@echo off
echo                                                                  ^&^&^#^#BGGGPGGB^&  
echo                                                                BGGGGGBB^#^&^&    ^&^#
echo                                                                GPPB          ^&GP
echo                                                                BPPP^#        ^#PP^#
echo                                                                ^&PBBB^#^&     BPP^# 
echo                            ^&BBBBBBBB^&                         ^#^#^#^&GG^&GPGGBGPP^&  
echo                            ^#PPPPPPPP^#                      ^#BGB^#^#^#^#^#BGGGGPPG^&   
echo                     ^&^&^#BGGGPPPPPPPPPPGGGB^#^&^&            ^&BGG^#^#BPG^#              
echo            ^#B^#  ^&^#BGPPPGGB^#^#^#^#^#^#^#^#^#^#^#^#BGGPPPGB^#^&     ^&BGPB^#^#GPG^#                
echo          ^#GPPPGGPPPB^#^&^&^&^#BBGGGGGGGGGGBB^#^#^&^#^#GPPPG^#^&BGPG^#^&BGPG^#                  
echo        ^#GPPPPPPPB^&^&^#BGPPPPPPPPPPPPPPPPPPPPGB^& ^&^#GPPPB^#^#BPPG^#                    
echo       ^&BPPPPPG^#^&^#BPPPPPPPPPPGGGGGGGGPPPPPGB^&^&^#GPPG^#^&^#GPPG^#                      
echo         BPPG^#^&^#GPPPPPPPGB^#^&^&        ^&^&^#^#^&^&^#GPPPG^#^&BGPPG^#                        
echo       ^&GPPB ^#GPPPPPPG^#^&                ^#BPPPGB^&^#BPPPG^#^&BG^&                      
echo      ^&GPP^# BPPPPPPB^&                ^#BPPPPG^#^&^#GPPPG^#^& ^#PPG^&                     
echo      GPP^# GPPPPPG^&               ^#BPPPPPB^&^&BPPPPG^#^&BPB ^#PPG                     
echo     BPPB GPPPPPB               ^#GPPPPG^#^&^#GPPPPG^#^&BPPPP^# BPPB                    
echo    ^&PPG ^#PPPPPG        ^&^#^#BBBB^#^#^#^#GG^#^&^#GPPPPG^#   GPPPPP^& GPP^&                   
echo GGGGPPB GPPPPP^&      BBBBB^& ^&^&^&^#BB^& BPPPPPG^#     ^&PPPPPB BPPGGGG                
echo PPPPPP^#^&PPPPPG     ^&GBBBGG^&^&GGB^& ^#G^&^&GPPG^#        GPPPPP^&^#PPPPPP                
echo PPPPPP^&^&PPPPPG     GB^#GGBBB^#BPGP^& ^#P ^#G^#          GPPPPP^&^&PPPPPG                
echo PPPPPP^# PPPPPP^&    G^#BGGBPB^&^#G^&^#^& ^&P^&            ^&PPPPPG ^#PPPPPG                
echo ^&^&^&^#PPG BPPPPPB    ^#G^#BBGGGGBBB^#B^&GB             BPPPPPB GPP^#^&^&^&                
echo     GPP^#^&PPPPPP^#    ^#GBBBBGGGBBBBG^#             ^#PPPPPP^&^#PPG                    
echo     ^&PPP^&^&PPPPPP^#     ^#BBBBBBBBB^#^&^#^#           ^#PPPPPP^&^&PPP^&                    
echo      ^#PPG^&^&PPPPPPG^&      ^&^&^#^#^#^& BPPPB        ^&GPPPPPP^&^&GPP^#                     
echo       ^#PPP^#^&GPPPPPPB^#      ^&GPG^&^&BPPPG^&    ^#BPPPPPPG^&^#PPP^#                      
echo        ^&GPPB^&^#GPPPPPPGB^#^&    BPPB ^#PPPPB ^&GPPPPPPG^#^&BPPG^&                       
echo        ^#GPPPPB^&^#BPPPPPPPPGGBB^&^&GPG^&^&GPPPG^&^&GPPPB^#^&BPPPPG^#                       
echo       ^&GPPPPPPPG^#^&^#BGPPPPPPPPP^# BPPB ^#PPPP^# B^#^#^#GPPPPPPPG^&                      
echo         ^&BPPPPPPPPG^#^#^#^#BGGPPPPPB^&^&GPG^&^&GPPPB  GPPPPPPPB^&                        
echo           ^&BGB^& ^#BGPPPGBB^#^#^#^#^#^#^#^#  BPP^# ^#PPPG^#^&^# ^&BGB^&                          
echo                    ^&^#BBGPPPPPGGGGPB^&^&GPG^&^&GPPPB                                 
echo                          ^&^&BPPPPPPPP^& BPP^# BPPPG^&                               
echo                            ^#PPPPPPPP^#  ^#PPG^&^&GPPP^#                              

pause 

cd C:\Users\User\Desktop\airquality-web
start http:\\localhost:1337 
make run_server

pause 