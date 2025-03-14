import cv2
import json
import os

with open('annotations.json','r') as f:
    annotations=json.load(f)
    
def draw_annotations(image_name,annotations):
    image=cv2.imread(image_name)
    
    for annotation in annotations:
        start_point = tuple(annotation['start'])
        end_point = tuple(annotation['end'])
        text = annotation['text']
        text_pos = tuple(annotation['text_pos'])
        
        cv2.arrowedLine(image, start_point, end_point, (0, 0, 0), 25)
        cv2.putText(image, text, text_pos, cv2.FONT_HERSHEY_DUPLEX, 3, (0, 0, 255), 8, cv2.LINE_AA)
    
    cv2.imshow(f"Annotated Image - {image_name}", image)
    cv2.waitKey(0)
    cv2.destroyAllWindows()
    
for image_name, image_annotations in annotations.items():
    if os.path.exists(image_name):
        draw_annotations(image_name, image_annotations)
    else:
        print(f"Image {image_name} does not exist!")