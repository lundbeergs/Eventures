# Generated by Django 3.1.2 on 2023-05-12 10:23

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('userprofile', '0006_auto_20230512_1021'),
    ]

    operations = [
        migrations.RenameField(
            model_name='ticket',
            old_name='event_id',
            new_name='event',
        ),
    ]
