import bpy
import os
import sys
from mathutils import *
from math import *


def origin_to_bottom(ob, matrix=Matrix()):
    me = ob.data
    mw = ob.matrix_world
    local_verts = [matrix @ Vector(v[:]) for v in ob.bound_box]
    o = sum(local_verts, Vector()) / 8
    o.z = min(v.z for v in local_verts)
    o = matrix.inverted() @ o
    me.transform(Matrix.Translation(-o))
    mw.translation = mw @ o


model_to_render = sys.argv[6]
print_material = sys.argv[7]
color = sys.argv[8]
shape = sys.argv[9]
D = bpy.data
walls = D.objects['Walls']

rotation_dictionary = {
    "skeleton": 0,
    "quarter": 270,
    "stairway": 180,
    "valley": 0,
    "crater": 0,
    "dome": 0,
    "monolith": 0,
    "spikes": 0,
    "basin": 0,
    "mesa": 0,
    "cove": 180,
    "stacks": 0,
    "comb": 0,
    "ridge": 0,
    "pillars": 0,
    "cross": 0
}

out_directory = "/tmp"
model_name = model_to_render.replace(".stl", "").replace("/tmp/", "")
bpy.ops.import_mesh.stl(filepath="{}/{}".format(out_directory, model_to_render),
                        filter_glob="*.stl",  files=[{"name": model_to_render}])
stl_model = D.objects[model_name]
ref = D.objects['ref']

colored_material = D.materials["{}_{}".format(print_material, color)]
stl_model.active_material = colored_material
walls.active_material = colored_material


origin_to_bottom(ref)
origin_to_bottom(stl_model)
stl_model.scale = ref.scale
stl_model.location = ref.location
stl_model.rotation_euler[2] = radians(rotation_dictionary[shape])
stl_data = stl_model.data
stl_data.update()

bpy.context.scene.camera = bpy.context.scene.objects["main"]
bpy.context.scene.render.filepath = "{}/{}.png".format(
    out_directory, model_name)
bpy.ops.render.render(write_still=True)
