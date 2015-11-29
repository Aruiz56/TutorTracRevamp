//
//  Tutor.m
//  TutorMe
//
//  Created by Marisa Gomez on 11/29/15.
//  Copyright © 2015 soft_dev2_group1. All rights reserved.
//

#import "Tutor.h"

@implementation Tutor
@synthesize fullname;
@synthesize studentID;
@synthesize schedule;

- (id) init {
    
    //Initialize schedule dictionary
    NSMutableArray *times = [[NSMutableArray alloc] init];
    schedule = [[NSMutableDictionary alloc] initWithObjects:@[times, times, times, times, times, times, times] forKeys:@[@"sunday", @"monday", @"tuesday", @"wednesday", @"thursday", @"friday", @"saturday"]];
    
    return self;
}

- (void)encodeWithCoder:(NSCoder *)encoder {
    //Encode properties, other class variables, etc
    [encoder encodeObject:self.fullname forKey:@"fullname"];
    [encoder encodeObject:self.studentID forKey:@"studentID"];
    [encoder encodeObject:self.schedule forKey:@"schedule"];
}

- (id)initWithCoder:(NSCoder *)decoder {
    if((self = [super init])) {
        //decode properties, other class vars
        self.fullname = [decoder decodeObjectForKey:@"fullname"];
        self.studentID = [decoder decodeObjectForKey:@"studentID"];
        self.schedule = [decoder decodeObjectForKey:@"schedule"];
    }
    return self;
}

@end