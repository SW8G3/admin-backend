import cv2
import json
import os
import numpy as np

with open('/Users/manishkhadka/Project/admin-backend/Overlay_test/Test_images/annotations.json', 'r') as f:
    annotations = json.load(f)


input_dir = "/Users/manishkhadka/Project/admin-backend/Overlay_test/Test_images"
output_dir = os.path.join(input_dir, "output")
os.makedirs(output_dir, exist_ok=True)  

def draw_annotations(image_name, annotations):
    image_path = os.path.join(input_dir, image_name)
    if not os.path.exists(image_path):
        print(f"Error: Image {image_name} not found at {image_path}")
        return
    
    image = cv2.imread(image_path)

    for annotation in annotations:
        start_point = tuple(annotation['start'])
        end_point = tuple(annotation['end'])
        text = annotation['text']
        text_pos = tuple(annotation['text_pos'])

        # Calculating the direction of the arrow
        dx = end_point[0] - start_point[0]
        dy = end_point[1] - start_point[1]

        # Adjusting text position based on arrow direction
        if abs(dx) > abs(dy):  # Horizontal arrow
            if dx > 0:
                text_pos = (end_point[0] + 20, end_point[1])
            else:
                text_pos = (start_point[0] + 20, start_point[1])
        else:  # Vertical arrow
            if dy > 0:
                text_pos = (end_point[0], end_point[1] + 30)
            else:
                text_pos = (start_point[0] - 15, start_point[1])

        # Drawing the arrow
        arrow_color = (0, 255, 255)  # Yellow
        arrow_thickness = 22
        cv2.arrowedLine(image, start_point, end_point, arrow_color, arrow_thickness, tipLength=0.1)

        font = cv2.FONT_HERSHEY_SIMPLEX
        text_color = (255, 255, 255)  # White
        outline_color = (0, 0, 0)  # Black
        font_scale = 3
        thickness = 7
        line_spacing = 10
        max_width = 900
        words = text.split()
        lines = []
        current_line = words[0]

        for word in words[1:]:
            (line_width, _), _ = cv2.getTextSize(current_line + " " + word, font, font_scale, thickness)
            if line_width <= max_width:
                current_line += " " + word
            else:
                lines.append(current_line)
                current_line = word
        lines.append(current_line)

        for i, line in enumerate(lines):
            y = text_pos[1] + i * (cv2.getTextSize(line, font, font_scale, thickness)[0][1] + i * line_spacing)
            cv2.putText(image, line, (text_pos[0], y), font, font_scale, outline_color, thickness + 17, cv2.LINE_AA)
            cv2.putText(image, line, (text_pos[0], y), font, font_scale, text_color, thickness, cv2.LINE_AA)

    output_path = os.path.join(output_dir, image_name)
    cv2.imwrite(output_path, image)
    print(f"Saved: {output_path}")


for image_name, image_annotations in annotations.items():
    draw_annotations(image_name, image_annotations)
