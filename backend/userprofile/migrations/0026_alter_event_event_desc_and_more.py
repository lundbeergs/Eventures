# Generated by Django 4.2.1 on 2023-05-26 11:46

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('userprofile', '0025_alter_membership_id_alter_membershiprequest_id'),
    ]

    operations = [
        migrations.AlterField(
            model_name='event',
            name='event_desc',
            field=models.CharField(max_length=1000),
        ),
        migrations.AlterField(
            model_name='organizationprofile',
            name='org_bio',
            field=models.CharField(max_length=1000),
        ),
    ]
