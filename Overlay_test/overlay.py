import cv2
import json
import os
import numpy as np

with open('/Users/manishkhadka/Project/admin-backend/Overlay_test/Test_images/annotations.json', 'r') as f:
    annotations = json.load(f)
    
def draw_annotations(image_name, annotations):
    image_path = os.path.join("/Users/manishkhadka/Project/admin-backend/Overlay_test/Test_images", image_name)
    if not os.path.exists(image_path):
        print(f"Error: Image {image_name} not found at {image_path}")
        return
    image = cv2.imread(image_path)

    for annotation in annotations:
        start_point = tuple(annotation['start'])
        end_point = tuple(annotation['end'])
        text = annotation['text']
        text_pos = tuple(annotation['text_pos'])
        rect_x1, rect_y1 = text_pos[0] - 10, text_pos[1] - 40

        arrow_color = (0, 255, 255)  # Yellow color for the arrows(color-blind friendly)
        arrow_thickness = 20
        cv2.arrowedLine(image, start_point, end_point, arrow_color, arrow_thickness, tipLength=0.1)  

        font = cv2.FONT_HERSHEY_SIMPLEX
        text_color = (255, 255, 255)  # White text for contrast
        cv2.putText(image, text, (rect_x1 + 10, rect_y1 + 35), font, 3, text_color, 4, cv2.LINE_AA)  

    cv2.imshow(f"Annotated Image - {image_name}", image)
    cv2.waitKey(0)
    cv2.destroyAllWindows()

for image_name, image_annotations in annotations.items():
    if os.path.exists(image_name):
        draw_annotations(image_name, image_annotations)
    else:
        print(f"Image {image_name} not found!")